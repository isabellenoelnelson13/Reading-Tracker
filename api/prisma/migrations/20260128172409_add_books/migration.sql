-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "shelf" TEXT NOT NULL DEFAULT 'TO_READ',
    "releaseDate" DATETIME,
    "finishedAt" DATETIME,
    "rating" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Book_shelf_idx" ON "Book"("shelf");

-- CreateIndex
CREATE INDEX "Book_releaseDate_idx" ON "Book"("releaseDate");

-- CreateIndex
CREATE INDEX "Book_finishedAt_idx" ON "Book"("finishedAt");
