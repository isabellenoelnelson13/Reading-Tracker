import type { Book, Shelf } from "../types/books"
import BookCard from "./BookCard"

function SkeletonRow() {
    return <div className="surface-card border-1 surface-border border-round-xl p-3 shadow-1" style={{ height: 86 }} />
}

export default function BookList({
                                     books,
                                     isLoading,
                                     emptyLabel,
                                     onMove,
                                     onSetRating,
                                     onDelete,
                                     actions,
                                 }: {
    books: Book[]
    isLoading: boolean
    emptyLabel: string
    onMove: (id: string, shelf: Shelf) => Promise<void>
    onSetRating: (id: string, rating: number | null) => Promise<void>
    onDelete: (id: string) => Promise<void>
    actions: {
        updateBook: (id: string, patch: { genres?: string[] }) => Promise<void>
        fetchCover: (id: string) => Promise<void>
        moveBook: (id: string, shelf: Shelf) => Promise<void>
        markReadWithReview: (id: string, finishedAt: string, rating: number | null, review: string | null) => Promise<void>
        setRating: (id: string, rating: number | null) => Promise<void>
        deleteBook: (id: string) => Promise<void>
    }
}) {
    if (isLoading) {
        return (
            <div className="flex flex-column gap-2">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
            </div>
        )
    }

    if (books.length === 0) {
        return (
            <div className="surface-card border-1 surface-border border-round-xl p-6 text-center shadow-1">
                <div className="text-lg font-semibold">Nothing here yet</div>
                <div className="text-color-secondary mt-2">{emptyLabel}</div>
            </div>
        )
    }

    return (
        <ul className="list-none p-0 m-0 flex flex-column gap-2">
            {books.map((b) => (
                <BookCard
                    key={b.id}
                    book={b}
                    onMove={onMove}
                    onMarkReadWithReview={actions.markReadWithReview}
                    onSetRating={onSetRating}
                    onDelete={onDelete}
                    onUpdateGenres={async (id: string, genres: string[]) => actions.updateBook(id, { genres })}
                    onFetchCover={actions.fetchCover}
                />
            ))}
        </ul>
    )
}
