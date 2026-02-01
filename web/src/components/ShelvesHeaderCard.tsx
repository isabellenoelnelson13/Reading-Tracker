import { Button } from "primereact/button"
import ShelfTabs from "./ShelfTabs"
import type { Shelf } from "../types/books"

export default function ShelvesHeaderCard({
                                              activeShelf,
                                              counts,
                                              onChangeShelf,
                                              onAdd,
                                              children,
                                          }: {
    activeShelf: Shelf
    counts: Record<"TO_READ" | "READ" | "UPCOMING", number>
    onChangeShelf: (s: Shelf) => void
    onAdd: () => void
    children?: React.ReactNode
}) {
    return (
        <div className="rt-card p-3 mb-3">
            <div className="flex align-items-center justify-content-between gap-3 mb-2">
                <div>
                    <div className="rt-title text-2xl font-bold">Shelves</div>
                    <div className="rt-subtitle">
                        Track what you’ve read, what’s next, and what’s coming soon.
                    </div>
                </div>

                <Button
                    label="Add book"
                    icon="pi pi-plus"
                    onClick={onAdd}
                    style={{ background: "var(--rt-accent)", borderColor: "var(--rt-accent)" }}
                />
            </div>

            <ShelfTabs active={activeShelf} counts={counts as any} onChange={onChangeShelf} />

            {/* Divider */}
            <div className="border-top-1 surface-border mt-3 pt-3">
                {children}
            </div>
        </div>
    )
}
