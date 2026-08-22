import { auth } from "@/auth"
import { restoreFiles } from "@/lib/google-drive"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  // @ts-ignore
  const token = session?.access_token as string | undefined
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { fileIds } = await req.json()
  if (!Array.isArray(fileIds)) return NextResponse.json({ error: "fileIds must be array" }, { status: 400 })
  const results = await restoreFiles(token, fileIds)
  return NextResponse.json({ results, restored: results.filter(r => r.ok).length })
}
