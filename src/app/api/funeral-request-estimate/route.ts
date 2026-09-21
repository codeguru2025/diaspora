import { NextResponse } from "next/server";
import { getFuneralRequestEstimate } from "@/lib/pol263";

export async function POST(req: Request) {
  let body: { addOnIds?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const addOnIds = Array.isArray(body.addOnIds) ? body.addOnIds.filter((id) => typeof id === "string") : [];
  const res = await getFuneralRequestEstimate(addOnIds);
  return NextResponse.json(res.data);
}
