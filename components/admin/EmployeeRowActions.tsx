"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function RowActions({
  employee,
  activeId,
  setActiveId,
  onEdit,
  onDelete,
}: {
  employee: any;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onEdit: (emp: any) => void;
  onDelete: (id: string) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [deleting, setDeleting] = useState(false);

  const isOpen = activeId === employee.id;

  useClickOutside(dropdownRef, () => setActiveId(null), isOpen);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const dropdownHeight = 100;
      const spaceBelow = window.innerHeight - rect.bottom;

      const openUpwards = spaceBelow < dropdownHeight;

      const dropdownWidth = 140;

      const left = Math.min(
        rect.right - dropdownWidth,
        window.innerWidth - dropdownWidth - 10,
      );

      setPosition({
        top: openUpwards
          ? rect.top + window.scrollY - dropdownHeight
          : rect.bottom + window.scrollY,
        left,
      });
    }
  }, [isOpen]);

  const handleDelete = async () => {
    setDeleting(true);

    toast("Delete employee?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await fetch(`/api/employee/${employee.id}`, {
              method: "DELETE",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Employee deleted");

            onDelete(employee.id);
            setActiveId(null);
          } catch (err: any) {
            toast.error(err.message);
          } finally {
            setDeleting(false);
          }
        },
      },
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      setActiveId(null);
    };

    window.addEventListener("scroll", handleScroll, true); // 👈 important: capture all scrolls

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, setActiveId]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => setActiveId(null);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, setActiveId]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setActiveId(isOpen ? null : employee.id)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              zIndex: 9999,
            }}
            className="w-36 bg-white border rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95"
          >
            <button
              onClick={() => {
                onEdit(employee);
                setActiveId(null);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Edit
            </button>

            {/* ✅ Divider */}
            <div className="h-px bg-gray-100 mx-2" />

            <button
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              disabled={deleting}
            >
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
