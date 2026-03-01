import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { playbackId } = await req.json();
  if (!playbackId) return NextResponse.json({ error: "Missing playbackId" }, { status: 400 });

  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const rawKey = process.env.MUX_SIGNING_KEY_PRIVATE;
  if (!keyId || !rawKey) return NextResponse.json({ error: "Missing Mux keys" }, { status: 500 });

  const privateKey = Buffer.from(rawKey, "base64").toString("utf-8");
  const token = jwt.sign(
    { sub: playbackId, aud: "v", exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, kid: keyId },
    privateKey,
    { algorithm: "RS256" }
  );

  return NextResponse.json({ token });
}
