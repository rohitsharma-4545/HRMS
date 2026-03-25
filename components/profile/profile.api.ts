export async function updateProfileSection(section: string, data: any) {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      section,
      data,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}
