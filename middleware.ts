import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function validSession(token: string | undefined) {
  const secret = process.env.EXECUTIVE_SESSION_SECRET;
  if (!token || !secret) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [id, issued, signature] = parts;
  const expected = crypto.createHmac("sha256", secret).update(`${id}.${issued}`).digest("hex");
  const age = Date.now() - Number(issued);
  return Boolean(id && Number.isFinite(Number(issued)) && age >= 0 && age <= 8 * 60 * 60 * 1000 && signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)));
}

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/executive") && req.nextUrl.pathname !== "/executive/login") {
    if (!validSession(req.cookies.get("executive_session")?.value)) {
      return NextResponse.redirect(new URL("/executive/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/executive/:path*"] };
