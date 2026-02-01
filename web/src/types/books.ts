export type Shelf = "TO_READ" | "READ" | "UPCOMING"

export type Book = {
    id: string
    title: string
    author: string | null
    shelf: Shelf
    releaseDate: string | null
    finishedAt: string | null
    coverUrl: string | null
    rating: number | null
    genres: string[] | null
    createdAt: string
    updatedAt: string
}


export const SHELVES: { key: Shelf; label: string; helper: string }[] = [
    { key: "TO_READ", label: "To Read", helper: "Stuff you want to pick up soon." },
    { key: "READ", label: "Read", helper: "Finished books, with ratings." },
    { key: "UPCOMING", label: "Upcoming", helper: "Books you’re waiting to release." },
]