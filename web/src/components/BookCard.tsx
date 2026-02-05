import type { Book, Shelf } from "../types/books"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"
import BookCover from "./BookCover"
import EditGenresDialog from "./EditGenresDialog"
import MarkAsReadDialog from "./MarkAsReadDialog"
import HalfStarRating from "./HalfStarRating"
import { useRef, useState } from "react"
import { Menu } from "primereact/menu"
import type { MenuItem } from "primereact/menuitem"



function formatDate(iso: string | null) {
    if (!iso) return ""
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ""
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

function todayISODateOnly() {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
}

function shelfLabel(shelf: Shelf) {
    if (shelf === "READ") return "Read"
    if (shelf === "UPCOMING") return "Upcoming"
    return "To Read"
}

export default function BookCard({
                                     book,
                                     onMove,
                                     onMarkReadWithReview,
                                     onSetRating,
                                     onDelete,
                                     onUpdateGenres,
    onFetchCover
                                 }: {
    book: Book
    onMove: (id: string, shelf: Shelf) => Promise<void>
    onMarkReadWithReview: (id: string, finishedAt: string, rating: number | null, review: string | null) => Promise<void>
    onSetRating: (id: string, rating: number | null) => Promise<void>
    onDelete: (id: string) => Promise<void>
    onUpdateGenres: (id: string, genres: string[]) => Promise<void>
    onFetchCover: (id: string) => Promise<void>

}) {
    const genres = Array.isArray((book as any).genres) ? (book as any).genres as string[] : []
    const [editOpen, setEditOpen] = useState(false)
    const [markReadOpen, setMarkReadOpen] = useState(false)

    const menuRef = useRef<Menu>(null)
    const [isBusy, setIsBusy] = useState(false)

    async function run(fn: () => Promise<void>) {
        try {
            setIsBusy(true)
            await fn()
        } finally {
            setIsBusy(false)
        }
    }

    const menuItems: MenuItem[] = [
        {
            label: "Edit book",
            icon: "pi pi-pencil",
            command: () => {
                // next step: wire EditBookModal (we’ll do right after menu is in)
                // for now, you can open your existing Add/Edit modal if you have one
            },
        },
        {
            label: "Edit genres",
            icon: "pi pi-tags",
            command: () => setEditOpen(true),
        },
        { separator: true },

        {
            label: "Move to…",
            icon: "pi pi-folder",
            items: [
                {
                    label: "To Read",
                    command: () => run(() => onMove(book.id, "TO_READ")),
                },
                {
                    label: "Upcoming",
                    command: () => run(() => onMove(book.id, "UPCOMING")),
                },
                {
                    label: "Read",
                    command: () => setMarkReadOpen(true),
                },
            ],
        },

        ...(book.shelf !== "READ"
            ? [
                {
                    label: "Mark as read",
                    icon: "pi pi-check",
                    command: () => setMarkReadOpen(true),
                },
            ]
            : []),

        ...(book.shelf !== "READ"
            ? []
            : [
                {
                    label: "Set rating",
                    icon: "pi pi-star",
                    disabled: true, // rating stays inline for now (or we can move it into Edit book)
                },
            ]),

        ...(book.coverUrl
            ? []
            : [
                {
                    label: "Fetch cover",
                    icon: "pi pi-refresh",
                    command: () => run(() => onFetchCover(book.id)),
                },
            ]),

        { separator: true },
        {
            label: "Delete",
            icon: "pi pi-trash",
            className: "p-menuitem-danger",
            command: () => run(() => onDelete(book.id)),
        },
    ]


    return (
        <li className="surface-card border-1 surface-border border-round-xl p-3 shadow-1" style={{ position: "relative" }}>
        <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between gap-3">
                {/* Left */}
                <div className="flex align-items-start gap-3" style={{ minWidth: 0 }}>
                    <div className="flex flex-column align-items-center gap-2">
                        <Menu model={menuItems} popup ref={menuRef} />

                        <Button
                            icon="pi pi-ellipsis-v"
                            className="rt-kebab-btn"
                            text
                            rounded
                            aria-label="Actions"
                            title="Actions"
                            disabled={isBusy}
                            onClick={(e) => menuRef.current?.toggle(e)}
                            style={{ position: "absolute", top: 10, right: 10 }}
                        />


                        <BookCover title={book.title} author={book.author} coverUrl={book.coverUrl} />

                        {!book.coverUrl && (<Button
                            icon="pi pi-refresh"
                            rounded
                            text
                            severity="secondary"
                            aria-label="Fetch cover"
                            title="Fetch cover"
                            onClick={() => onFetchCover(book.id)}
                        />)}

                    </div>


                    <div className="flex flex-column gap-2" style={{ minWidth: 0 }}>
                        <div className="flex flex-wrap align-items-center gap-2">
                            <div
                                className="text-lg font-semibold"
                                style={{
                                    maxWidth: 520,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {book.title}
                            </div>

                            {/* No severity → avoids teal/bright theme colors */}
                            <Tag value={shelfLabel(book.shelf)} className="p-tag" rounded />

                            {book.shelf === "UPCOMING" && book.releaseDate && (
                                <Tag value={`Releases ${formatDate(book.releaseDate)}`} className="p-tag" rounded />
                            )}

                            {book.shelf === "READ" && book.finishedAt && (
                                <Tag value={`Finished ${formatDate(book.finishedAt)}`} className="p-tag" rounded />
                            )}
                        </div>

                        <div className="text-color-secondary">{book.author ? book.author : "—"}</div>

                        {genres.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {genres.map((g) => (
                                    <span key={g} className="rt-chip">
                    {g}
                  </span>
                                ))}
                            </div>
                        )}


                        {book.shelf === "READ" && (
                            <div className="flex align-items-center gap-2">
                                <span className="text-sm font-medium text-color-secondary">Rating</span>
                                <HalfStarRating
                                    value={book.rating}
                                    cancel
                                    onChange={(val) => onSetRating(book.id, val)}
                                />
                            </div>
                        )}

                        {book.shelf === "READ" && book.review && (
                            <div
                                className="text-sm text-color-secondary"
                                style={{
                                    fontStyle: "italic",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.5,
                                }}
                            >
                                {book.review}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <EditGenresDialog
                open={editOpen}
                title={book.title}
                initialGenres={genres}
                onClose={() => setEditOpen(false)}
                onSave={async (next) => {
                    await onUpdateGenres(book.id, next)
                }}
            />
            <MarkAsReadDialog
                open={markReadOpen}
                title={book.title}
                author={book.author}
                onClose={() => setMarkReadOpen(false)}
                onSave={async ({ rating, review }) => {
                    await onMarkReadWithReview(book.id, todayISODateOnly(), rating, review)
                }}
            />

        </li>
    )
}
