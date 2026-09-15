import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();
    const expectedId = process.env.EXECUTIVE_ID;
    const expectedPassword = process.env.EXECUTIVE_PASSWORD;
    const secret = process.env.EXECUTIVE_SESSION_SECRET;
    if (!expectedId || !expectedPassword || !secret || id !== expectedId || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const value = `${id}.${Date.now()}`;
    const token = `${value}.${sign(value, secret)}`;
    const cookieStore = await cookies();
    cookieStore.set("executive_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
