"use client";

import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function NoticeRowActions({
  notice,
  activeId,
  setActiveId,
  onEdit,
  onDelete,
}: any) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = activeId === notice.id;

  useClickOutside(dropdownRef, () => setActiveId(null), isOpen);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + window.scrollY,
      left: rect.right - 140,
    });
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setActiveId(isOpen ? null : notice.id)}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "absolute", top: pos.top, left: pos.left }}
            className="w-36 bg-white border rounded-xl shadow"
          >
            <button
              onClick={() => {
                onEdit(notice);
                setActiveId(null);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </button>

            <div className="h-px bg-gray-100 mx-2" />

            <button
              onClick={() => {
                onEdit(notice);
                setActiveId(null);
              }}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
