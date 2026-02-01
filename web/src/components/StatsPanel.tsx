import { Card } from "primereact/card"

export type Stats = {
    readTotal: number
    readThisMonth: number
    avgRating: number | null
    upcoming: number
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
    return (
        <Card className="shadow-1 border-round-xl">
            <div className="flex flex-column gap-2">
                <div className="text-sm text-color-secondary">{label}</div>
                <div className="text-3xl font-semibold">{value}</div>
                {sub && <div className="text-sm text-color-secondary">{sub}</div>}
            </div>
        </Card>
    )
}

export default function StatsPanel({ stats }: { stats: Stats }) {
    return (
        <div className="grid mb-3">
            <div className="col-12 md:col-3">
                <StatCard label="Read" value={String(stats.readTotal)} sub="All time" />
            </div>
            <div className="col-12 md:col-3">
                <StatCard label="Read this month" value={String(stats.readThisMonth)} />
            </div>
            <div className="col-12 md:col-3">
                <StatCard
                    label="Avg rating"
                    value={stats.avgRating == null ? "—" : stats.avgRating.toFixed(1)}
                    sub={stats.avgRating == null ? "Rate a few books" : "From rated books"}
                />
            </div>
            <div className="col-12 md:col-3">
                <StatCard label="Upcoming" value={String(stats.upcoming)} sub="Coming soon" />
            </div>
        </div>
    )
}
