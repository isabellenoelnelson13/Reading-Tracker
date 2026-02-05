import { useCallback, useMemo, useState } from "react"
import Shell from "./components/Shell"
import NavBar, { type PageKey } from "./components/NavBar"
import ShelvesHeaderCard from "./components/ShelvesHeaderCard"
import BookList from "./components/BookList"
import AddBookModal from "./components/AddBookModal"
import FilterBar from "./components/FilterBar"
import StatsPanel from "./components/StatsPanel"
import { useBooksApi } from "./hooks/useBooksApi"
import type { Shelf } from "./types/books"

export default function App() {
    const [page, setPage] = useState<PageKey>("SHELVES")
    const [activeShelf, setActiveShelf] = useState<Shelf>("TO_READ")
    const [addOpen, setAddOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])

    const { books, counts, stats, isLoading, error, actions } = useBooksApi(activeShelf)

    const changeShelf = useCallback((shelf: Shelf) => {
        setActiveShelf(shelf)
        setSearchText("")
        setSelectedGenres([])
    }, [])

    const filteredBooks = useMemo(() => {
        let result = books
        if (searchText) {
            const lower = searchText.toLowerCase()
            result = result.filter(
                (b) =>
                    b.title.toLowerCase().includes(lower) ||
                    (b.author && b.author.toLowerCase().includes(lower)),
            )
        }
        if (selectedGenres.length > 0) {
            result = result.filter(
                (b) => b.genres && b.genres.some((g) => selectedGenres.includes(g)),
            )
        }
        return result
    }, [books, searchText, selectedGenres])

    return (
        <>
            <NavBar active={page} onNavigate={setPage} />

            <Shell>
                {page === "SHELVES" ? (
                    <>
                        <ShelvesHeaderCard
                            activeShelf={activeShelf}
                            counts={counts}
                            onChangeShelf={changeShelf}
                            onAdd={() => setAddOpen(true)}
                        >
                            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

                            {counts[activeShelf] > 0 && (
                                <FilterBar
                                    searchText={searchText}
                                    onSearchChange={setSearchText}
                                    selectedGenres={selectedGenres}
                                    onGenresChange={setSelectedGenres}
                                />
                            )}

                            <BookList
                                books={filteredBooks}
                                isLoading={isLoading}
                                emptyLabel="Add your first book to start building your shelves."
                                onMove={actions.moveBook}
                                onSetRating={actions.setRating}
                                onDelete={actions.deleteBook}
                                actions={actions}
                            />
                        </ShelvesHeaderCard>

                        <AddBookModal
                            open={addOpen}
                            defaultShelf={activeShelf}
                            onClose={() => setAddOpen(false)}
                            onSubmit={actions.addBook}
                        />
                    </>
                ) : (
                    <div className="rt-card p-3">
                        <div className="rt-title text-2xl font-bold mb-2">My Stats</div>
                        <div className="rt-subtitle mb-3">A quick snapshot of your reading life.</div>
                        <StatsPanel stats={stats} />
                    </div>
                )}
            </Shell>
        </>
    )
}
