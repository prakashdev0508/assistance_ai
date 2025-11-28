-- CreateTable
CREATE TABLE "DashboardData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardData_userId_key" ON "DashboardData"("userId");

-- CreateIndex
CREATE INDEX "DashboardData_userId_idx" ON "DashboardData"("userId");

-- CreateIndex
CREATE INDEX "DashboardData_lastSyncAt_idx" ON "DashboardData"("lastSyncAt");

-- AddForeignKey
ALTER TABLE "DashboardData" ADD CONSTRAINT "DashboardData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
