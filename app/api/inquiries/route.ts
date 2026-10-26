import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { inquiries } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";
import {
  products,
  materials,
  finishes,
  estimate,
  budgets,
  timelines,
  statuses,
} from "../../catalog-data";
const shape = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(180),
    phone: z.string().trim().max(35).default(""),
    location: z.string().trim().min(2).max(140),
    productId: z.string(),
    material: z.string(),
    finish: z.string(),
    quantity: z.number().int().min(1).max(50),
    dimensions: z.string().trim().max(160).default(""),
    budget: z.string().refine((v) => budgets.includes(v)),
    timeline: z.string().refine((v) => timelines.includes(v)),
    message: z.string().trim().min(10).max(2500),
    consent: z.literal("on"),
  })
  .superRefine((v, c) => {
    const p = products.find((p) => p.id === v.productId);
    if (!p && v.productId !== "custom")
      c.addIssue({
        code: "custom",
        message: "Choose a valid product",
        path: ["productId"],
      });
    if (
      !materials.some((m) => m.id === v.material) ||
      (p && !p.materials.includes(v.material))
    )
      c.addIssue({
        code: "custom",
        message: "Choose an available material",
        path: ["material"],
      });
    if (
      !finishes.some((f) => f.id === v.finish) ||
      (p && !p.finishes.includes(v.finish))
    )
      c.addIssue({
        code: "custom",
        message: "Choose an available finish",
        path: ["finish"],
      });
  });
function sameOrigin(req: Request) {
  return req.headers.get("origin") === new URL(req.url).origin;
}
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json(
      { error: "This request is not allowed." },
      { status: 403 },
    );
  if (Number(req.headers.get("content-length") || 0) > 18000)
    return NextResponse.json(
      { error: "Your inquiry is too long." },
      { status: 413 },
    );
  let raw;
  try {
    const text = await req.text();
    if (text.length > 18000)
      return NextResponse.json(
        { error: "Your inquiry is too long." },
        { status: 413 },
      );
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Please submit a valid inquiry." },
      { status: 400 },
    );
  }
  const result = shape.safeParse(raw);
  if (!result.success)
    return NextResponse.json(
      {
        error:
          "Please check your contact details, selections, and consent. Include at least 10 characters about your idea.",
      },
      { status: 400 },
    );
  const { consent, ...data } = result.data;
  const id = crypto.randomUUID(),
    reference = "SO-" + id.slice(0, 8).toUpperCase();
  try {
    await getDb()
      .insert(inquiries)
      .values({
        ...data,
        id,
        reference,
        estimate: estimate(data.productId, data.material, data.quantity),
        createdAt: new Date().toISOString(),
        status: "New",
      });
    return NextResponse.json({ reference }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We could not save your inquiry. Please try again." },
      { status: 500 },
    );
  }
}
// This studio inbox relies on the owner-private Sites access boundary.
// Add a server-side administrator allowlist before changing the site to public.
export async function GET() {
  if (!(await getChatGPTUser()))
    return NextResponse.json(
      { error: "Sign in is required." },
      { status: 401 },
    );
  const data = await getDb()
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt));
  return NextResponse.json(
    { inquiries: data },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function PATCH(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 },
    );
  if (!(await getChatGPTUser()))
    return NextResponse.json(
      { error: "Sign in is required." },
      { status: 401 },
    );
  let raw;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const p = z
    .object({
      id: z.string().uuid(),
      status: z.string().refine((v) => statuses.includes(v)),
    })
    .safeParse(raw);
  if (!p.success)
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  const updated = await getDb()
    .update(inquiries)
    .set({ status: p.data.status })
    .where(eq(inquiries.id, p.data.id))
    .returning({ id: inquiries.id });
  return NextResponse.json({ updated: updated.length > 0 });
}
