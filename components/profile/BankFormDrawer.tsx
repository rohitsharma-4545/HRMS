"use client";

import clsx from "clsx";
import { useState, useMemo, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const POPULAR_BANKS = ["HDFC", "SBI", "ICICI", "Axis", "Kotak", "PNB"];

export default function BankFormDrawer({
  open,
  onClose,
  employeeId,
  existingBanks = [],
  bankToEdit,
}: any) {
  useEffect(() => {
    if (!open) return;

    if (bankToEdit) {
      setForm({
        bankName: bankToEdit.bankName,
        branchName: bankToEdit.branchName || "",
        accountHolderName: bankToEdit.accountHolderName,
        accountNumber: bankToEdit.accountNumber,
        accountType: bankToEdit.accountType,
        ifscCode: bankToEdit.ifscCode,
        isDefault: bankToEdit.isDefault,
      });
      setSearch(bankToEdit.bankName);
    } else {
      setForm({
        bankName: "",
        branchName: "",
        accountHolderName: "",
        accountNumber: "",
        accountType: "",
        ifscCode: "",
        isDefault: false,
      });
      setSearch("");
    }
  }, [open, bankToEdit]);

  const router = useRouter();

  const drawerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");
  const [showBankOptions, setShowBankOptions] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState({
    bankName: "",
    branchName: "",
    accountHolderName: "",
    accountNumber: "",
    accountType: "",
    ifscCode: "",
    isDefault: false,
  });

  useState(() => {
    if (bankToEdit) {
      setForm({
        bankName: bankToEdit.bankName,
        branchName: bankToEdit.branchName || "",
        accountHolderName: bankToEdit.accountHolderName,
        accountNumber: bankToEdit.accountNumber,
        accountType: bankToEdit.accountType,
        ifscCode: bankToEdit.ifscCode,
        isDefault: bankToEdit.isDefault,
      });
      setSearch(bankToEdit.bankName);
    }
  });

  useClickOutside(drawerRef, onClose, open);

  useClickOutside(
    dropdownRef,
    () => setShowBankOptions(false),
    showBankOptions,
  );

  const filteredBanks = useMemo(() => {
    return POPULAR_BANKS.filter((bank) =>
      bank.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const hasDefault = existingBanks?.some((b: any) => b.isDefault);

  async function handleSubmit() {
    const newErrors: any = {};

    if (!form.bankName) newErrors.bankName = "Bank name is required";
    if (!form.accountHolderName)
      newErrors.accountHolderName = "Account holder name is required";
    if (!form.accountNumber)
      newErrors.accountNumber = "Account number is required";
    if (!form.accountType) newErrors.accountType = "Select account type";
    if (!form.ifscCode) newErrors.ifscCode = "IFSC code is required";

    const hasDefault = existingBanks?.some((b: any) => b.isDefault);

    if (!hasDefault && !form.isDefault) {
      newErrors.isDefault = "One bank must be default";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const res = await fetch("/api/bank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        employeeId,
        id: bankToEdit?.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error || "Something went wrong");
      return;
    }

    toast.success(
      bankToEdit ? "Bank updated successfully" : "Bank added successfully",
    );

    onClose();

    // Soft reload
    router.refresh();
  }

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300",
        open ? "opacity-100 visible" : "opacity-0 invisible",
      )}
    >
      <div
        ref={drawerRef}
        className={clsx(
          "absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-all duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="p-6 space-y-4 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Bank Details</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* 🔎 Searchable Bank Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <input
              placeholder="Search Bank"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowBankOptions(true);
                setErrors({ ...errors, bankName: null });
              }}
              onFocus={() => setShowBankOptions(true)}
              className={clsx(
                "w-full border p-2 rounded",
                errors.bankName && "border-red-500",
              )}
            />
            {errors.bankName && (
              <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>
            )}

            {showBankOptions && (
              <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <div
                      key={bank}
                      onClick={() => {
                        setForm({ ...form, bankName: bank });
                        setSearch(bank);
                        setShowBankOptions(false);
                      }}
                      className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                    >
                      {bank}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-slate-500">
                    No banks found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Branch */}
          <input
            placeholder="Branch Name"
            value={form.branchName}
            onChange={(e) => setForm({ ...form, branchName: e.target.value })}
            className="w-full border p-2 rounded"
          />

          {/* Account Holder */}
          <input
            placeholder="Account Holder Name"
            value={form.accountHolderName}
            onChange={(e) => {
              setForm({ ...form, accountHolderName: e.target.value });
              setErrors({ ...errors, accountHolderName: null });
            }}
            className={clsx(
              "w-full border p-2 rounded",
              errors.accountHolderName && "border-red-500",
            )}
          />
          {errors.accountHolderName && (
            <p className="text-xs text-red-500 mt-1">
              {errors.accountHolderName}
            </p>
          )}

          {/* Account Number */}
          <input
            placeholder="Account Number"
            value={form.accountNumber}
            onChange={(e) => {
              setForm({ ...form, accountNumber: e.target.value });
              setErrors({ ...errors, accountNumber: null });
            }}
            className={clsx(
              "w-full border p-2 rounded",
              errors.accountNumber && "border-red-500",
            )}
          />
          {errors.accountNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
          )}

          {/* 🏦 Account Type */}
          <select
            value={form.accountType}
            onChange={(e) => {
              setForm({ ...form, accountType: e.target.value });
              setErrors({ ...errors, accountType: null });
            }}
            className={clsx(
              "w-full border p-2 rounded",
              errors.accountType && "border-red-500",
            )}
          >
            <option value="">Select Account Type</option>
            <option value="SAVINGS">Savings</option>
            <option value="CURRENT">Current</option>
          </select>
          {errors.accountType && (
            <p className="text-xs text-red-500 mt-1">{errors.accountType}</p>
          )}

          {/* IFSC */}
          <input
            placeholder="IFSC Code"
            value={form.ifscCode}
            onChange={(e) => {
              setForm({
                ...form,
                ifscCode: e.target.value.toUpperCase(),
              });
              setErrors({ ...errors, ifscCode: null });
            }}
            className={clsx(
              "w-full border p-2 rounded",
              errors.ifscCode && "border-red-500",
            )}
          />
          {errors.ifscCode && (
            <p className="text-xs text-red-500 mt-1">{errors.ifscCode}</p>
          )}

          {/* Default Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
            <label>Set as default</label>
          </div>
          {errors.isDefault && (
            <p className="text-xs text-red-500">{errors.isDefault}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Save
            </button>

            <button
              onClick={onClose}
              className="border px-4 py-2 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
