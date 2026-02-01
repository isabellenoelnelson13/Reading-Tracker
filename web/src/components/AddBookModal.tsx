import { useEffect, useState } from "react"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Dropdown } from "primereact/dropdown"
import { MultiSelect } from "primereact/multiselect"
import type { Shelf } from "../types/books"
import { SHELVES } from "../types/books"
import { GENRES } from "../types/genres"

type Props = {
    open: boolean
    defaultShelf: Shelf
    onClose: () => void
    onSubmit: (data: {
        title: string
        author?: string
        shelf: Shelf
        releaseDate?: string
        genres?: string[]
    }) => Promise<void>
}

export default function AddBookModal({ open, defaultShelf, onClose, onSubmit }: Props) {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [shelf, setShelf] = useState<Shelf>(defaultShelf)
    const [releaseDate, setReleaseDate] = useState("")
    const [genres, setGenres] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setShelf(defaultShelf)
            setError(null)
        }
    }, [open, defaultShelf])

    async function submit() {
        const cleanTitle = title.trim()
        const cleanAuthor = author.trim()

        if (!cleanTitle) {
            setError("Title is required.")
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            await onSubmit({
                title: cleanTitle,
                author: cleanAuthor ? cleanAuthor : undefined,
                shelf,
                genres: genres.length ? genres : undefined,
                releaseDate: shelf === "UPCOMING" && releaseDate ? releaseDate : undefined,
            })

            setTitle("")
            setAuthor("")
            setReleaseDate("")
            setGenres([])
            onClose()
        } catch (e: any) {
            setError(e?.message ?? "Failed to add book.")
        } finally {
            setIsSaving(false)
        }
    }

    const shelfOptions = SHELVES.map((s) => ({ label: s.label, value: s.key }))
    const genreOptions = GENRES.map((g) => ({ label: g, value: g }))

    return (
        <Dialog
            header="Add a book"
            visible={open}
            onHide={onClose}
            modal
            draggable={false}
            className="w-11 md:w-6"
            contentClassName="p-0"
        >
            <div className="p-4">
                <div className="formgrid grid">
                    <div className="field col-12">
                        <label htmlFor="title" className="font-medium">
                            Title
                        </label>
                        <InputText
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full"
                            placeholder="e.g. One Dark Window"
                            autoFocus
                        />
                    </div>

                    <div className="field col-12">
                        <label htmlFor="author" className="font-medium">
                            Author
                        </label>
                        <InputText
                            id="author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full"
                            placeholder="optional"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="genres" className="font-medium">
                            Genres
                        </label>
                        <MultiSelect
                            id="genres"
                            value={genres}
                            onChange={(e) => setGenres(e.value ?? [])}
                            options={genreOptions}
                            placeholder="Select genres"
                            display="chip"
                            showClear
                            className="w-full"
                        />
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="shelf" className="font-medium">
                            Shelf
                        </label>
                        <Dropdown id="shelf" value={shelf} onChange={(e) => setShelf(e.value)} options={shelfOptions} className="w-full" />
                    </div>

                    {shelf === "UPCOMING" && (
                        <div className="field col-12 md:col-6">
                            <label htmlFor="releaseDate" className="font-medium">
                                Release date
                            </label>
                            <input
                                id="releaseDate"
                                type="date"
                                value={releaseDate}
                                onChange={(e) => setReleaseDate(e.target.value)}
                                className="w-full p-inputtext"
                            />
                        </div>
                    )}
                </div>

                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Cancel" severity="secondary" outlined onClick={onClose} />
                    <Button label={isSaving ? "Adding…" : "Add"} onClick={submit} disabled={isSaving} />
                </div>
            </div>
        </Dialog>
    )
}
