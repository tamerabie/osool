import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: candidates } = await supabase
    .from("transactions")
    .select("*")
    .in("status", ["completed", "closed"])
    .neq("archived", true)
    .limit(500);

  const toArchive = (candidates ?? []).filter(
    (t) =>
      t.status === "closed" ||
      (t.status === "completed" &&
        (Number(t.agreed_fees) || 0) > 0 &&
        (Number(t.paid_fees) || 0) >= (Number(t.agreed_fees) || 0))
  );

  if (toArchive.length === 0) {
    return NextResponse.json({ archived: 0 });
  }

  const today = new Date().toISOString().slice(0, 10);
  let archived = 0;
  for (const t of toArchive) {
    const { error } = await supabase
      .from("transactions")
      .update({ archived: true, archived_date: today })
      .eq("id", t.id);
    if (!error) archived++;
  }

  return NextResponse.json({ archived });
}
