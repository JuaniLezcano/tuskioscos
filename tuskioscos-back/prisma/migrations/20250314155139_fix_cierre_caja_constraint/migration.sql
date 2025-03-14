/*
  Warnings:

  - A unique constraint covering the columns `[kioscoId,fecha]` on the table `CierreCaja` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CierreCaja_fecha_key";

-- CreateIndex
CREATE UNIQUE INDEX "CierreCaja_kioscoId_fecha_key" ON "CierreCaja"("kioscoId", "fecha");
