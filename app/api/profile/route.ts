import { NextResponse } from "next/server";
import { updateProfileSection } from "@/modules/profile/profile.controller";

export async function PATCH(req: Request) {
  const body = await req.json();

  const result = await updateProfileSection(body.section, body.data);

  return NextResponse.json(result);
}
