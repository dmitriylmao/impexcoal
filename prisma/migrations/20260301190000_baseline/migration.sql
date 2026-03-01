CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "News" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "imgUrl" TEXT,
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "projectId" TEXT NOT NULL,
  CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NewsTranslation" (
  "id" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "newsId" TEXT NOT NULL,
  CONSTRAINT "NewsTranslation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Product" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "imgUrl" TEXT NOT NULL,
  "price" TEXT,
  "projectId" TEXT NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductTranslation" (
  "id" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE INDEX "NewsTranslation_locale_idx" ON "NewsTranslation"("locale");
CREATE UNIQUE INDEX "NewsTranslation_newsId_locale_key" ON "NewsTranslation"("newsId", "locale");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "ProductTranslation_locale_idx" ON "ProductTranslation"("locale");
CREATE UNIQUE INDEX "ProductTranslation_productId_locale_key" ON "ProductTranslation"("productId", "locale");

ALTER TABLE "News"
  ADD CONSTRAINT "News_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "NewsTranslation"
  ADD CONSTRAINT "NewsTranslation_newsId_fkey"
  FOREIGN KEY ("newsId") REFERENCES "News"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProductTranslation"
  ADD CONSTRAINT "ProductTranslation_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
