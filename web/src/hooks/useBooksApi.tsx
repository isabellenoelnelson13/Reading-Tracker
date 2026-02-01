import { useCallback, useEffect, useState } from "react"
import type { Book, Shelf } from "../types/books"
import { useToast } from "../components/ToastProvider"

async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(path, init)
    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Request failed (${res.status})`)
    }
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
}

function normalizeGenres(value: any): string[] {
    if (!Array.isArray(value)) return []
    return value.filter((g) => typeof g === "string").map((g) => g.trim()).filter(Boolean)
}

function normalizeBook(raw: any): Book {
    return {
        ...raw,
        genres: normalizeGenres(raw?.genres),
    } as Book
}

function normalizeBooks(raw: any): Book[] {
    if (!Array.isArray(raw)) return []
    return raw.map(normalizeBook)
}

export function useBooksApi(activeShelf: Shelf) {
    const toast = useToast()
    const [books, setBooks] = useState<Book[]>([])
    const [counts, setCounts] = useState<Record<Shelf, number>>({
        TO_READ: 0,
        READ: 0,
        UPCOMING: 0,
    })
    const [stats, setStats] = useState({
        readTotal: 0,
        readThisMonth: 0,
        avgRating: null as number | null,
        upcoming: 0,
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadBooks = useCallback(async (shelf: Shelf) => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await api<any>(`/api/books?shelf=${encodeURIComponent(shelf)}`)
            setBooks(normalizeBooks(data))
        } catch (e: any) {
            setBooks([])
            setError(e?.message ?? "Failed to load books")
        } finally {
            setIsLoading(false)
        }
    }, [])


    const refreshCounts = useCallback(async () => {
        try {
            const [toRead, read, upcoming] = await Promise.all([
                api<any>(`/api/books?shelf=TO_READ`),
                api<any>(`/api/books?shelf=READ`),
                api<any>(`/api/books?shelf=UPCOMING`),
            ])

            const toReadArr = Array.isArray(toRead) ? toRead : []
            const readArr = Array.isArray(read) ? read : []
            const upcomingArr = Array.isArray(upcoming) ? upcoming : []

            setCounts({
                TO_READ: toReadArr.length,
                READ: readArr.length,
                UPCOMING: upcomingArr.length,
            })

            // --- stats ---
            const now = new Date()
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

            let readThisMonth = 0
            let ratingSum = 0
            let ratingCount = 0

            for (const b of readArr) {
                const finishedAt = b?.finishedAt ? new Date(b.finishedAt) : null
                if (finishedAt && finishedAt >= monthStart && finishedAt < nextMonthStart) {
                    readThisMonth += 1
                }

                const r = b?.rating
                if (typeof r === "number" && Number.isFinite(r)) {
                    ratingSum += r
                    ratingCount += 1
                }
            }

            setStats({
                readTotal: readArr.length,
                readThisMonth,
                avgRating: ratingCount ? ratingSum / ratingCount : null,
                upcoming: upcomingArr.length,
            })
        } catch {
            // counts/stats are “nice to have”; don't block UI
        }
    }, [])

    useEffect(() => {
        loadBooks(activeShelf)
        refreshCounts()
    }, [activeShelf, loadBooks, refreshCounts])

    async function addBook(input: {
        title: string
        author?: string
        shelf: Shelf
        releaseDate?: string
        genres?: string[]
    }): Promise<void> {
        setError(null)

        await api<any>("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        })

        await Promise.all([loadBooks(activeShelf), refreshCounts()])
        toast.show("Book added.", "success")
    }


    async function moveBook(bookId: string, shelf: Shelf) {
        setError(null)
        await api<Book>(`/api/books/${bookId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shelf }),
        })
        await Promise.all([loadBooks(activeShelf), refreshCounts()])
        toast.show("Book moved.", "info")
    }

    async function updateBook(
        bookId: string,
        patch: { genres?: string[]; title?: string; author?: string | null; shelf?: Shelf; releaseDate?: string | null; finishedAt?: string | null; rating?: number | null }
    ) {
        setError(null)
        await api<Book>(`/api/books/${bookId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        })
        await Promise.all([loadBooks(activeShelf), refreshCounts()])
    }


    async function markRead(bookId: string, finishedAtISODateOnly: string) {
        setError(null)
        await api<Book>(`/api/books/${bookId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shelf: "READ", finishedAt: finishedAtISODateOnly }),
        })
        await Promise.all([loadBooks(activeShelf), refreshCounts()])
        toast.show("Marked as read.", "success")
    }

    async function setRating(bookId: string, rating: number | null) {
        setError(null)
        await api<Book>(`/api/books/${bookId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating }),
        })
        await loadBooks(activeShelf)
    }

    async function deleteBook(bookId: string) {
        setError(null)
        await api<void>(`/api/books/${bookId}`, { method: "DELETE" })
        await Promise.all([loadBooks(activeShelf), refreshCounts()])
        toast.show("Book deleted.", "success")
    }

    async function fetchCover(bookId: string) {
        await api<Book>(`/api/books/${bookId}/fetch-cover`, { method: "POST" })
        await loadBooks(activeShelf)
        toast.show("Cover updated.", "success")
    }


    return {
        books,
        counts,
        stats,
        isLoading,
        error,
        actions: { addBook, moveBook, markRead, setRating, deleteBook, reload: loadBooks, updateBook, fetchCover },
    }
}
