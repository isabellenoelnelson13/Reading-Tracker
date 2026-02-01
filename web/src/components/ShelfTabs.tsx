import { TabMenu } from "primereact/tabmenu"
import type { Shelf } from "../types/books"
import { SHELVES } from "../types/books"

export default function ShelfTabs({
                                      active,
                                      counts,
                                      onChange,
                                  }: {
    active: Shelf
    counts: Record<Shelf, number>
    onChange: (s: Shelf) => void
}) {
    const items = SHELVES.map((s) => ({
        label: `${s.label} (${counts[s.key]})`,
        command: () => onChange(s.key),
    }))

    const activeIndex = Math.max(0, SHELVES.findIndex((s) => s.key === active))

    return (
        <div className="mb-3">
            <TabMenu model={items} activeIndex={activeIndex} />
        </div>
    )
}
