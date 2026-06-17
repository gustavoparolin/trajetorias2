-- CreateTable
CREATE TABLE "competencia" (
    "cod" INTEGER NOT NULL,
    "indClassificacao" VARCHAR(1),
    "nome" VARCHAR(500) NOT NULL,
    "descr" TEXT,
    "sigla" VARCHAR(20),
    "seqApresentacao" INTEGER,
    "dthoraIniVigencia" DATE NOT NULL,
    "dthoraFimVigencia" DATE,
    CONSTRAINT "competencia_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "comportamento" (
    "cod" INTEGER NOT NULL,
    "codCompetencia" INTEGER NOT NULL,
    "nome" VARCHAR(500) NOT NULL,
    "descr" TEXT,
    "sigla" VARCHAR(20),
    "seqApresentacao" INTEGER,
    "dthoraIniVigencia" DATE NOT NULL,
    "dthoraFimVigencia" DATE,
    CONSTRAINT "comportamento_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "trajetoria_competencia" (
    "cod" INTEGER NOT NULL,
    "codTrajetoria" INTEGER NOT NULL,
    "codCompetencia" INTEGER NOT NULL,
    "seqApresentacao" INTEGER,
    "dthoraIniVigencia" DATE NOT NULL,
    "dthoraFimVigencia" DATE,
    CONSTRAINT "trajetoria_competencia_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "espaco_ocupacional" (
    "cod" INTEGER NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    CONSTRAINT "espaco_ocupacional_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "trajetoria_espaco" (
    "codEspaco" INTEGER NOT NULL,
    "codTrajetoria" INTEGER NOT NULL,
    CONSTRAINT "trajetoria_espaco_pkey" PRIMARY KEY ("codEspaco", "codTrajetoria")
);

-- CreateTable
CREATE TABLE "pessoa" (
    "codPessoaFisica" INTEGER NOT NULL,
    "nomeAnonimizado" VARCHAR(50) NOT NULL,
    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("codPessoaFisica")
);

-- CreateTable
CREATE TABLE "pessoa_trajetoria" (
    "cod" INTEGER NOT NULL,
    "codPessoaFisica" INTEGER NOT NULL,
    "codTrajetoria" INTEGER NOT NULL,
    "dataAdesao" DATE,
    CONSTRAINT "pessoa_trajetoria_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "pessoa_trajetoria_nivel" (
    "cod" INTEGER NOT NULL,
    "codPessoaTrajetoria" INTEGER NOT NULL,
    "codTrajetoriaNivel" INTEGER NOT NULL,
    "seHabilitado" BOOLEAN NOT NULL DEFAULT false,
    "dataSolicitacao" DATE,
    "dataAvaliacao" DATE,
    CONSTRAINT "pessoa_trajetoria_nivel_pkey" PRIMARY KEY ("cod")
);

-- CreateTable
CREATE TABLE "pessoa_autoavaliacao" (
    "cod" INTEGER NOT NULL,
    "codPessoaFisica" INTEGER NOT NULL,
    "codComportamento" INTEGER NOT NULL,
    "grau" INTEGER NOT NULL,
    "seHomologado" BOOLEAN NOT NULL DEFAULT false,
    "dataAvaliacao" DATE,
    CONSTRAINT "pessoa_autoavaliacao_pkey" PRIMARY KEY ("cod")
);

-- AddForeignKey
ALTER TABLE "comportamento" ADD CONSTRAINT "comportamento_codCompetencia_fkey"
    FOREIGN KEY ("codCompetencia") REFERENCES "competencia"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajetoria_competencia" ADD CONSTRAINT "trajetoria_competencia_codTrajetoria_fkey"
    FOREIGN KEY ("codTrajetoria") REFERENCES "trajetoria"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajetoria_competencia" ADD CONSTRAINT "trajetoria_competencia_codCompetencia_fkey"
    FOREIGN KEY ("codCompetencia") REFERENCES "competencia"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajetoria_espaco" ADD CONSTRAINT "trajetoria_espaco_codEspaco_fkey"
    FOREIGN KEY ("codEspaco") REFERENCES "espaco_ocupacional"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajetoria_espaco" ADD CONSTRAINT "trajetoria_espaco_codTrajetoria_fkey"
    FOREIGN KEY ("codTrajetoria") REFERENCES "trajetoria"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_trajetoria" ADD CONSTRAINT "pessoa_trajetoria_codPessoaFisica_fkey"
    FOREIGN KEY ("codPessoaFisica") REFERENCES "pessoa"("codPessoaFisica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_trajetoria" ADD CONSTRAINT "pessoa_trajetoria_codTrajetoria_fkey"
    FOREIGN KEY ("codTrajetoria") REFERENCES "trajetoria"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_trajetoria_nivel" ADD CONSTRAINT "pessoa_trajetoria_nivel_codPessoaTrajetoria_fkey"
    FOREIGN KEY ("codPessoaTrajetoria") REFERENCES "pessoa_trajetoria"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_trajetoria_nivel" ADD CONSTRAINT "pessoa_trajetoria_nivel_codTrajetoriaNivel_fkey"
    FOREIGN KEY ("codTrajetoriaNivel") REFERENCES "trajetoria_nivel"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_autoavaliacao" ADD CONSTRAINT "pessoa_autoavaliacao_codPessoaFisica_fkey"
    FOREIGN KEY ("codPessoaFisica") REFERENCES "pessoa"("codPessoaFisica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoa_autoavaliacao" ADD CONSTRAINT "pessoa_autoavaliacao_codComportamento_fkey"
    FOREIGN KEY ("codComportamento") REFERENCES "comportamento"("cod") ON DELETE RESTRICT ON UPDATE CASCADE;
