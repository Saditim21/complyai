import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  company_name: z.string().max(200).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, company_name } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, company_name: company_name ?? null });

  if (error) {
    // PostgreSQL unique violation
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "duplicate", message: "This email is already on the waitlist." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
