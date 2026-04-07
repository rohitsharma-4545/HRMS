"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function HolidayRowActions({
  holiday,
  activeId,
  setActiveId,
  onEdit,
  onDelete,
}: {
  holiday: any;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onEdit: (h: any) => void;
  onDelete: (id: string) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = activeId === holiday.id;

  useClickOutside(dropdownRef, () => setActiveId(null), isOpen);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 140,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setActiveId(null);

    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setActiveId(isOpen ? null : holiday.id)}
        className="p-2 rounded-lg hover:bg-gray-100"
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
            className="w-36 bg-white border rounded-xl shadow-lg overflow-hidden"
          >
            <button
              onClick={() => {
                onEdit(holiday);
                setActiveId(null);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>

            <div className="h-px bg-gray-100 mx-2" />

            <button
              onClick={() => {
                onDelete(holiday.id);
                setActiveId(null);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
