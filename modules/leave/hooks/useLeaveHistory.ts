"use client";

import { useEffect, useState } from "react";

export function useLeaveHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leave/history")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  console.log(data);

  return { data, loading };
}
