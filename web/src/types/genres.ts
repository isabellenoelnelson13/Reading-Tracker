export const GENRES = [
    "Fantasy",
    "Romance",
    "Mystery/Thriller",
    "Sci-Fi",
    "Historical",
    "Contemporary",
    "Horror",
    "Nonfiction",
    "Memoir",
    "YA",
] as const

export type Genre = (typeof GENRES)[number]
