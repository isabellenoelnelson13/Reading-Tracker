type Props = {
    title: string
    author: string | null
    coverUrl?: string | null
}

export default function BookCover({ title, author, coverUrl }: Props) {
    const fallbackText = title?.charAt(0)?.toUpperCase() ?? "?"

    return (
        <div
            className="rt-book-cover shadow-2 border-round-lg overflow-hidden flex align-items-center justify-content-center"
            title={`${title}${author ? ` — ${author}` : ""}`}
        >
            {coverUrl ? (
                <img
                    src={coverUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <div className="rt-book-cover-fallback">
                    {fallbackText}
                </div>
            )}
        </div>
    )
}
