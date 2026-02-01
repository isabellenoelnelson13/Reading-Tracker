import { useEffect } from "react"

type Props = {
    open: boolean
    title: string
    children: React.ReactNode
    onClose: () => void
}

export default function Modal({ open, title, children, onClose }: Props) {
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="px-5 py-4">{children}</div>
                </div>
            </div>
        </div>
    )
}
