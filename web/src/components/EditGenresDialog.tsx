import { useEffect, useMemo, useState } from "react"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import { MultiSelect } from "primereact/multiselect"
import { GENRES } from "../types/genres"

type Props = {
    open: boolean
    title: string
    initialGenres: string[]
    onClose: () => void
    onSave: (genres: string[]) => Promise<void>
}

export default function EditGenresDialog({ open, title, initialGenres, onClose, onSave }: Props) {
    const [genres, setGenres] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setGenres(Array.isArray(initialGenres) ? initialGenres : [])
            setError(null)
        }
    }, [open, initialGenres])

    const options = useMemo(() => GENRES.map((g) => ({ label: g, value: g })), [])

    async function save() {
        setIsSaving(true)
        setError(null)
        try {
            await onSave(genres)
            onClose()
        } catch (e: any) {
            setError(e?.message ?? "Failed to update genres.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog
            header="Edit genres"
            visible={open}
            onHide={onClose}
            modal
            draggable={false}
            className="w-11 md:w-6"
            contentClassName="p-0"
        >
            <div className="p-4">
                <div className="text-sm text-color-secondary mb-3" style={{ lineHeight: 1.4 }}>
                    <span className="font-medium">Book:</span> {title}
                </div>

                <div className="field">
                    <label htmlFor="genres" className="font-medium">
                        Genres
                    </label>
                    <MultiSelect
                        id="genres"
                        value={genres}
                        onChange={(e) => setGenres(e.value ?? [])}
                        options={options}
                        placeholder="Select genres"
                        display="chip"
                        showClear
                        className="w-full"
                    />
                </div>

                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Cancel" severity="secondary" outlined onClick={onClose} />
                    <Button label={isSaving ? "Saving…" : "Save"} onClick={save} disabled={isSaving} />
                </div>
            </div>
        </Dialog>
    )
}
