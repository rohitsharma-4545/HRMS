"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import BankFormDrawer from "./BankFormDrawer";

export default function BankingSection({ employeeId, banks = [] }: any) {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);

  const hasBank = banks.length > 0;
  const canAddMore = banks.length < 3;

  function handleEdit(bank: any) {
    setSelectedBank(bank);
    setOpen(true);
  }

  function handleAdd() {
    setSelectedBank(null);
    setOpen(true);
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Banking</h2>

          {hasBank && (
            <button
              onClick={handleAdd}
              disabled={!canAddMore}
              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-40"
              title="Add Bank"
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        {/* Empty State */}
        {!hasBank && (
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">
                "Boring but critical info. This is where the money goes."
              </p>

              <button
                onClick={handleAdd}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Bank
              </button>
            </div>

            <img src="/bank-illustration.png" className="h-28" alt="bank" />
          </div>
        )}

        {/* Bank List */}
        {hasBank && (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {banks.map((bank: any) => (
              <div
                key={bank.id}
                className="border rounded-xl p-4 relative bg-slate-50"
              >
                {/* Edit Icon */}
                <button
                  onClick={() => handleEdit(bank)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-white"
                >
                  <Pencil size={16} />
                </button>

                <div className="space-y-1 text-sm">
                  <div className="font-medium">{bank.bankName}</div>
                  <div>A/C: ****{bank.accountNumber.slice(-4)}</div>
                  <div className="text-slate-500">
                    {bank.accountType}
                    {bank.isDefault && (
                      <span className="ml-2 text-xs text-blue-600">
                        (Default)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!canAddMore && (
              <p className="text-xs text-slate-400 text-center pt-2">
                Maximum 3 bank accounts allowed
              </p>
            )}
          </div>
        )}
      </div>

      <BankFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        employeeId={employeeId}
        existingBanks={banks}
        bankToEdit={selectedBank}
      />
    </>
  );
}
