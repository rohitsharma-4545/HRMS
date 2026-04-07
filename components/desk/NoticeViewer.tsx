"use client";

import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function NoticeViewer({ notice, onClose }: any) {
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, onClose, true);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={ref}
        className="bg-white w-[600px] max-h-[80vh] overflow-y-auto rounded-xl p-6 space-y-4"
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">{notice.title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <p className="text-sm text-gray-500">
          {new Date(notice.createdAt).toLocaleString()} •{" "}
          <span className="font-medium">
            {notice.createdBy?.firstName} {notice.createdBy?.lastName}
          </span>
        </p>

        <div className="text-sm whitespace-pre-wrap text-gray-700">
          {notice.content}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">
            👀 {notice.acknowledgements?.length || 0} acknowledged
          </p>

          {notice.acknowledgements.length === 0 ? (
            <p className="text-sm text-gray-500">No acknowledgements yet</p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-1">
              {notice.acknowledgements.map((a: any) => (
                <div
                  key={a.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {a.employee?.firstName} {a.employee?.lastName}
                  </span>

                  <span className="text-gray-400 text-xs">
                    {new Date(a.acknowledgedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
