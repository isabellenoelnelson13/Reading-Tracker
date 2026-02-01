import { Button } from "primereact/button"

export type PageKey = "SHELVES" | "STATS"

export default function NavBar({
                                   active,
                                   onNavigate,
                                   right,
                               }: {
    active: PageKey
    onNavigate: (p: PageKey) => void
    right?: React.ReactNode
}) {
    const linkClass = (isActive: boolean) =>
        [
            "px-3 py-2 border-round-lg text-sm font-medium",
            isActive ? "surface-200" : "surface-0",
        ].join(" ")

    return (
        <header
            className="border-bottom-1 surface-border rt-nav"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                background: "rgba(251,246,238,0.88)",
                backdropFilter: "blur(10px)",
            }}
        >
            <div className="flex align-items-center justify-content-between px-4 py-3">
                <div className="flex align-items-center gap-3">
                    <div className="rt-title text-2xl font-bold" style={{ letterSpacing: "-0.02em" }}>
                        Reading Tracker
                    </div>

                    <nav className="flex align-items-center gap-2">
                        <Button
                            label="Shelves"
                            text
                            className={linkClass(active === "SHELVES")}
                            onClick={() => onNavigate("SHELVES")}
                        />
                        <Button
                            label="My Stats"
                            text
                            className={linkClass(active === "STATS")}
                            onClick={() => onNavigate("STATS")}
                        />
                    </nav>
                </div>

                <div className="flex align-items-center gap-2">{right}</div>
            </div>
        </header>
    )
}
