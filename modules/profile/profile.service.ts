import { prisma } from "@/lib/prisma";

function normalizeDate(value?: string | null) {
  if (!value) return null;

  return new Date(value);
}

function normalizeDependent(data: any) {
  return {
    relation: data.relation,
    firstName: data.firstName,
    lastName: data.lastName ?? null,
    phone: data.phone ?? null,
    birthDate: data.birthDate ? new Date(data.birthDate) : null,
  };
}

export async function getEmployeeProfile(empCode: string) {
  return prisma.employee.findUnique({
    where: { employeeCode: empCode },
    include: {
      user: true,
      department: {
        include: {
          employees: {
            select: {
              id: true,
              employeeCode: true,
              firstName: true,
              lastName: true,
              designation: true,
            },
          },
        },
      },

      personalProfile: true,
      addresses: true,
      contacts: true,

      dependents: true,

      workProfile: true,
      reportingOffice: true,
      experiences: true,

      bankDetails: true,
      documents: true,
    },
  });
}

export async function upsertPersonalProfile(employeeId: string, data: any) {
  const existing = await prisma.personalProfile.findUnique({
    where: { employeeId },
  });

  const normalizedData = {
    ...data,
    birthDate: normalizeDate(data.birthDate),
    partnerBirthDate: normalizeDate(data.partnerBirthDate),
    anniversaryDate: normalizeDate(data.anniversaryDate),
  };

  if (existing) {
    return prisma.personalProfile.update({
      where: { employeeId },
      data: normalizedData,
    });
  }

  if (!data.firstName) {
    throw new Error("firstName is required to create profile");
  }

  return prisma.personalProfile.create({
    data: {
      employeeId,
      ...normalizedData,
    },
  });
}

export async function upsertAddress(employeeId: string, data: any) {
  return prisma.address.upsert({
    where: {
      employeeId_type: {
        employeeId,
        type: data.type,
      },
    },
    update: {
      address1: data.line1,
      address2: data.line2,
      country: data.country,
      state: data.state,
      city: data.city,
      postalCode: data.postalCode,
    },
    create: {
      employeeId,
      type: data.type,
      address1: data.line1,
      address2: data.line2,
      country: data.country,
      state: data.state,
      city: data.city,
      postalCode: data.postalCode,
    },
  });
}

export async function upsertContact(employeeId: string, data: any) {
  return prisma.contact.upsert({
    where: {
      employeeId_type_tag: {
        employeeId,
        type: data.type,
        tag: data.tag,
      },
    },
    update: {
      value: data.value,
    },
    create: {
      employeeId,
      type: data.type,
      tag: data.tag,
      value: data.value,
    },
  });
}

export async function upsertDependent(employeeId: string, data: any) {
  const items = Array.isArray(data) ? data : [data];

  return Promise.all(
    items.map((item) => {
      const normalized = normalizeDependent(item);

      if (item.id) {
        return prisma.dependent.update({
          where: { id: item.id },
          data: normalized,
        });
      }

      return prisma.dependent.create({
        data: {
          employeeId,
          ...normalized,
        },
      });
    }),
  );
}

export async function deleteDependent(employeeId: string, id: string) {
  return prisma.dependent.delete({
    where: { id },
  });
}

export async function deleteAddress(employeeId: string, id: string) {
  return prisma.address.delete({
    where: { id },
  });
}

export async function deleteContact(employeeId: string, id: string) {
  return prisma.contact.delete({
    where: { id },
  });
}

export async function upsertWorkProfile(employeeId: string, data: any) {
  const normalized = {
    ...data,
    probationEndDate: data.probationEndDate
      ? new Date(data.probationEndDate)
      : null,
    confirmationDate: data.confirmationDate
      ? new Date(data.confirmationDate)
      : null,
    noticeStartDate: data.noticeStartDate
      ? new Date(data.noticeStartDate)
      : null,
    exitDate: data.exitDate ? new Date(data.exitDate) : null,
  };

  return prisma.workProfile.upsert({
    where: { employeeId },
    update: normalized,
    create: {
      employeeId,
      ...normalized,
    },
  });
}
