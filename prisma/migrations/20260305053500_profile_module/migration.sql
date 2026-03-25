-- CreateTable
CREATE TABLE "PersonalProfile" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "salutation" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT,
    "about" TEXT,
    "gender" TEXT,
    "bloodGroup" TEXT,
    "genderPronoun" TEXT,
    "challenged" BOOLEAN,
    "maritalStatus" TEXT,
    "partnerName" TEXT,
    "birthDate" TIMESTAMP(3),
    "partnerBirthDate" TIMESTAMP(3),
    "anniversaryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dependent" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dependent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkProfile" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employmentStage" TEXT,
    "employmentType" TEXT,
    "employmentGrade" TEXT,
    "selfService" BOOLEAN NOT NULL DEFAULT true,
    "probationEndDate" TIMESTAMP(3),
    "confirmationDate" TIMESTAMP(3),
    "noticeStartDate" TIMESTAMP(3),
    "exitDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportingOffice" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "officeName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportingOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalProfile_employeeId_key" ON "PersonalProfile"("employeeId");

-- CreateIndex
CREATE INDEX "Address_employeeId_idx" ON "Address"("employeeId");

-- CreateIndex
CREATE INDEX "Contact_employeeId_idx" ON "Contact"("employeeId");

-- CreateIndex
CREATE INDEX "Dependent_employeeId_idx" ON "Dependent"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkProfile_employeeId_key" ON "WorkProfile"("employeeId");

-- CreateIndex
CREATE INDEX "ReportingOffice_employeeId_idx" ON "ReportingOffice"("employeeId");

-- CreateIndex
CREATE INDEX "Experience_employeeId_idx" ON "Experience"("employeeId");

-- AddForeignKey
ALTER TABLE "PersonalProfile" ADD CONSTRAINT "PersonalProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependent" ADD CONSTRAINT "Dependent_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkProfile" ADD CONSTRAINT "WorkProfile_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportingOffice" ADD CONSTRAINT "ReportingOffice_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
