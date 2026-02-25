import { NextResponse } from "next/server";
import { loginWithPassword } from "@/app/modules/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    const { token } = await loginWithPassword(identifier, password);

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
