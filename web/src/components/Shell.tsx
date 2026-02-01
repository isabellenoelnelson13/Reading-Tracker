export default function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <main className="px-4 py-4">
                <div className="mx-auto" style={{ maxWidth: 980 }}>
                    {children}
                </div>
            </main>
        </div>
    )
}