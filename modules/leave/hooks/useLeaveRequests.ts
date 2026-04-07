"use client";

import { useEffect, useState } from "react";

export function useLeaveRequests() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = () => {
    setLoading(true);
    fetch("/api/leave/requests")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(refetch, []);

  return { data, loading, refetch };
}
