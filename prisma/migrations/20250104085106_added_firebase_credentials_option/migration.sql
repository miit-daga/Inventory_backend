-- CreateTable
CREATE TABLE "firebaseData" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "authDomain" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "messagingSenderId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "measurementId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "firebaseData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "firebaseData_clientId_key" ON "firebaseData"("clientId");

-- AddForeignKey
ALTER TABLE "firebaseData" ADD CONSTRAINT "firebaseData_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
