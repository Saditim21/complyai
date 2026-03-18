// Document generation API (Claude API)
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Document generation endpoint" });
}
