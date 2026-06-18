-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "perfil" VARCHAR(20) NOT NULL,
    "chefeId" INTEGER,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_login_key" ON "usuario"("login");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_chefeId_fkey"
    FOREIGN KEY ("chefeId") REFERENCES "usuario"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
