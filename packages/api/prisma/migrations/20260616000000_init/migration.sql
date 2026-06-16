-- CreateTable
CREATE TABLE "trajetoria" (
    "cod" INTEGER NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "sigla" VARCHAR(10) NOT NULL,
    "sePublicadaSite" BOOLEAN NOT NULL DEFAULT false,
    "dthoraIniVigencia" DATE NOT NULL,
    "dthoraFimVigencia" DATE,

    CONSTRAINT "trajetoria_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "trajetoria_nivel" (
    "cod" INTEGER NOT NULL,
    "codTrajetoria" INTEGER NOT NULL,
    "indNivelTrajetoria" INTEGER NOT NULL,
    "descr" TEXT NOT NULL,
    "dthoraIniVigencia" DATE NOT NULL,
    "dthoraFimVigencia" DATE,

    CONSTRAINT "trajetoria_nivel_pkey" PRIMARY KEY ("cod")
);

-- AddForeignKey
ALTER TABLE "trajetoria_nivel" ADD CONSTRAINT "trajetoria_nivel_codTrajetoria_fkey"
    FOREIGN KEY ("codTrajetoria") REFERENCES "trajetoria"("cod")
    ON DELETE RESTRICT ON UPDATE CASCADE;
