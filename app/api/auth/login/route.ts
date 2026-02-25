import { NextResponse } from "next/server";
import { loginWithPassword } from "@/app/modules/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    const result = await loginWithPassword(identifier, password);

    const response = NextResponse.json({
      success: true,
      token: result.token,
      forcePasswordChange: result.forcePasswordChange || false,
    });

    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
