import express from "express"
import cors from "cors"
import "dotenv/config"
import { itemsRouter } from "./routes/items.routes.js"
import {booksRouter} from "./routes/books.routes.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => res.json({ ok: true }))

// Mount routes:
app.use("/items", itemsRouter)

app.use("/books", booksRouter)

// (Optional) helpful 404 for debugging
app.use((req, res) => {
    res.status(404).json({ error: `No route for ${req.method} ${req.path}` })
})

const PORT = Number(process.env.PORT ?? 3001)
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
