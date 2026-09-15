import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();
    const expectedId = process.env.EXECUTIVE_ID;
    const expectedPassword = process.env.EXECUTIVE_PASSWORD;
    if (!expectedId || !expectedPassword || id !== expectedId || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const store = globalThis as typeof globalThis & { __executiveSessions?: Set<string> };
    store.__executiveSessions ??= new Set<string>();
    store.__executiveSessions.add(token);

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
