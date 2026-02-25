import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) throw new Error("Unauthorized");

    const decoded: any = verifyToken(token);

    if (!decoded.passwordChangeRequired) {
      throw new Error("Not allowed");
    }

    const body = await req.json();
    const { newPassword } = body;

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashed,
        forcePasswordChange: false,
      },
    });

    const newToken = signToken({
      userId: decoded.userId,
      roles: decoded.roles,
      employeeId: decoded.employeeId,
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("token", newToken, {
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
