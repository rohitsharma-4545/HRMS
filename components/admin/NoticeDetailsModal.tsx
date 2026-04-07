"use client";

import { useState, useEffect } from "react";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function NoticeDetailsModal({ notice, onClose }: any) {
  const [showAck, setShowAck] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const acknowledgements = notice.acknowledgements || [];
  const targets = notice.targets || [];

  useClickOutside(modalRef, onClose, true);

  useEffect(() => {
    const handleScroll = () => onClose();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {notice.title}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              By{" "}
              <span className="font-medium text-gray-700">
                {notice.createdBy?.firstName} {notice.createdBy?.lastName}
              </span>{" "}
              • {new Date(notice.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Priority Badge */}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                notice.priority === "CRITICAL"
                  ? "bg-red-100 text-red-700"
                  : notice.priority === "HIGH"
                    ? "bg-orange-100 text-orange-700"
                    : notice.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
              }`}
            >
              {notice.priority}
            </span>

            {/* Status */}
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                notice.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {notice.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Dates */}
          {notice.expiresAt && (
            <div className="text-sm text-gray-500">
              ⏳ Expires: {new Date(notice.expiresAt).toLocaleString()}
            </div>
          )}

          {/* Targets */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Target Audience
            </h3>

            {targets.length === 0 ? (
              <span className="text-sm text-gray-500">🌍 All Employees</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {targets.map((t: any) => (
                  <span
                    key={t.id}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {t.department?.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {notice.content}
          </div>

          {/* Acknowledgements */}
          <div>
            <button
              onClick={() => setShowAck(!showAck)}
              className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2"
            >
              👀 {acknowledgements.length} Acknowledged
            </button>

            {showAck && (
              <div className="mt-3 border rounded-lg max-h-40 overflow-y-auto divide-y">
                {acknowledgements.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500">
                    No acknowledgements yet
                  </p>
                ) : (
                  acknowledgements.map((a: any) => (
                    <div
                      key={a.id}
                      className="p-3 text-sm flex justify-between"
                    >
                      <span>
                        {a.employee.firstName} {a.employee.lastName}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(a.acknowledgedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
