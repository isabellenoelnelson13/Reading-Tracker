import { createContext, useContext, useMemo, useRef } from "react"
import { Toast } from "primereact/toast"

type ToastSeverity = "success" | "info" | "warn" | "error"

type ToastApi = {
    show: (message: string, severity?: ToastSeverity, summary?: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const toastRef = useRef<Toast>(null)

    const api = useMemo<ToastApi>(() => {
        return {
            show: (message, severity = "info", summary) => {
                toastRef.current?.show({
                    severity,
                    summary: summary ?? (severity === "success" ? "Success" : severity === "error" ? "Error" : "Info"),
                    detail: message,
                    life: 3200,
                })
            },
        }
    }, [])

    return (
        <ToastContext.Provider value={api}>
            {children}
            <Toast ref={toastRef} position="bottom-right" />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used within ToastProvider")
    return ctx
}
