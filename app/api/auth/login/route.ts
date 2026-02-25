import { NextResponse } from "next/server";
import { loginWithPassword } from "@/app/modules/auth/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    const result = await loginWithPassword(identifier, password);

    if (result.forcePasswordChange) {
      return NextResponse.json({
        forcePasswordChange: true,
        token: result.token,
      });
    }

    return NextResponse.json({
      success: true,
      token: result.token,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
