import { auth } from "@/auth"
import { listTrashedFiles } from "@/lib/google-drive"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  // @ts-ignore
  const token = session?.access_token as string | undefined
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const pageToken = searchParams.get("pageToken") || undefined
  const data = await listTrashedFiles(token, pageToken)
  return NextResponse.json(data)
}
