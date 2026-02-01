import { Router } from "express"
import { prisma } from "../db.js"

export const itemsRouter = Router()

// GET /items
itemsRouter.get("/", async (_req, res) => {
    const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } })
    res.json(items)
})

// POST /items
itemsRouter.post("/", async (req, res) => {
    const title = String(req.body?.title ?? "").trim()
    if (!title) return res.status(400).json({ error: "title is required" })

    const item = await prisma.item.create({ data: { title } })
    res.status(201).json(item)
})
