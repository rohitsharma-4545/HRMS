import { prisma } from "@/lib/prisma";

interface UpsertBankInput {
  id?: string; // present when updating
  employeeId: string;
  bankName: string;
  branchName?: string;
  accountHolderName: string;
  accountNumber: string;
  accountType: "SAVINGS" | "CURRENT";
  ifscCode: string;
  isDefault: boolean;
}

export async function upsertBankDetail(data: UpsertBankInput) {
  return prisma.$transaction(async (tx) => {
    // If setting default, unset previous default
    if (data.isDefault) {
      await tx.bankDetail.updateMany({
        where: {
          employeeId: data.employeeId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update
    if (data.id) {
      return tx.bankDetail.update({
        where: { id: data.id },
        data,
      });
    }

    // Create
    return tx.bankDetail.create({
      data,
    });
  });
}
