import { Router } from "express"
import { prisma } from "../db.js"

export const booksRouter = Router()

function parseGenres(value: any): string[] {
    if (!Array.isArray(value)) return []
    return value.map((g) => String(g).trim()).filter(Boolean)
}

async function promoteReleasedBooks() {
    const now = new Date()
    now.setHours(23, 59, 59, 999)
    await prisma.book.updateMany({
        where: {
            shelf: "UPCOMING",
            releaseDate: { lte: now },
        },
        data: { shelf: "TO_READ" },
    })
}

async function fetchCoverUrl(title: string, author: string | null): Promise<string | null> {
    const q = [
        `intitle:${title}`,
        author ? `inauthor:${author}` : null,
    ].filter(Boolean).join("+")

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=1`

    try {
        const res = await fetch(url)
        if (!res.ok) return null
        const data: any = await res.json()
        const item = data?.items?.[0]?.volumeInfo

        // Prefer larger images if available
        const links = item?.imageLinks
        const raw =
            links?.extraLarge ??
            links?.large ??
            links?.medium ??
            links?.thumbnail ??
            links?.smallThumbnail ??
            null

        if (!raw) return null

        // Make sure it’s https and request a larger size when possible
        const https = String(raw).replace(/^http:/, "https:")
        return https.replace(/&zoom=\d+/, "&zoom=2")
    } catch {
        return null
    }
}



booksRouter.get("/", async (req, res) => {
    await promoteReleasedBooks()

    const shelf = String(req.query.shelf ?? "").trim()
    const where = shelf ? { shelf: shelf as any } : {}

    const books = await prisma.book.findMany({
        where,
        orderBy:
            shelf === "UPCOMING"
                ? [{ releaseDate: "asc" }, { createdAt: "desc" }]
                : shelf === "READ"
                    ? [{ finishedAt: "desc" }, { createdAt: "desc" }]
                    : [{ createdAt: "desc" }],
    })

    res.json(books)
})

booksRouter.post("/", async (req, res) => {
    const title = String(req.body?.title ?? "").trim()
    if (!title) return res.status(400).json({ error: "title is required" })

    const author = req.body?.author ? String(req.body.author).trim() : null
    const rawShelf = String(req.body?.shelf ?? "TO_READ").trim()

    const shelf = ["TO_READ", "READ", "UPCOMING"].includes(rawShelf)
        ? (rawShelf as "TO_READ" | "READ" | "UPCOMING")
        : "TO_READ"

    // ✅ genre support
    const genres = parseGenres(req.body?.genres)


    // dates can come in as "YYYY-MM-DD" (from input[type=date]) or ISO strings
    const releaseDate = req.body?.releaseDate ? new Date(req.body.releaseDate) : null
    const finishedAt = req.body?.finishedAt ? new Date(req.body.finishedAt) : null
    const rating = req.body?.rating != null ? Number(req.body.rating) : null
    const review = req.body?.review ? String(req.body.review).trim() : null

    const coverUrl = await fetchCoverUrl(title, author)


    const book = await prisma.book.create({
        data: {
            title,
            author,
            shelf,
            coverUrl,
            genres,
            releaseDate,
            finishedAt,
            rating,
            review,
        },
    })

    res.status(201).json(book)
})

booksRouter.patch("/:id", async (req, res) => {
    const id = String(req.params.id)

    const data: any = {}

    if (req.body?.title !== undefined) data.title = req.body.title ? String(req.body.title).trim() : ""
    if (req.body?.author !== undefined) data.author = req.body.author ? String(req.body.author).trim() : null
    if (req.body?.shelf !== undefined) {
        const rawShelf = String(req.body.shelf).trim()
        if (["TO_READ", "READ", "UPCOMING"].includes(rawShelf)) {
            data.shelf = rawShelf as "TO_READ" | "READ" | "UPCOMING"
        }
    }

    // ✅ genre support (allow clearing with null/empty)
    if (req.body?.genres !== undefined) data.genres = parseGenres(req.body.genres)

    if (req.body?.releaseDate !== undefined)
        data.releaseDate = req.body.releaseDate ? new Date(req.body.releaseDate) : null

    if (req.body?.finishedAt !== undefined)
        data.finishedAt = req.body.finishedAt ? new Date(req.body.finishedAt) : null

    if (req.body?.rating !== undefined)
        data.rating = req.body.rating == null ? null : Number(req.body.rating)

    if (req.body?.review !== undefined)
        data.review = req.body.review ? String(req.body.review).trim() : null

    const book = await prisma.book.update({ where: { id }, data })
    res.json(book)
})

booksRouter.delete("/:id", async (req, res) => {
    const id = String(req.params.id)
    await prisma.book.delete({ where: { id } })
    res.status(204).send()
})

booksRouter.post("/:id/fetch-cover", async (req, res) => {
    const id = String(req.params.id)
    const book = await prisma.book.findUnique({ where: { id } })
    if (!book) return res.status(404).json({ error: "Not found" })

    const coverUrl = await fetchCoverUrl(book.title, book.author)
    const updated = await prisma.book.update({
        where: { id },
        data: { coverUrl },
    })
    res.json(updated)
})

