import { prisma } from "@/lib/prisma";

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
  return prisma.personalProfile.upsert({
    where: { employeeId },
    update: data,
    create: {
      employeeId,
      ...data,
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
