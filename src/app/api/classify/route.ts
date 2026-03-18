// Risk classification API
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Classification endpoint" });
}
