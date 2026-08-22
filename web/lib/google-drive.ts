import { google } from "googleapis"

function getDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  return google.drive({ version: "v3", auth })
}

export async function listTrashedFiles(accessToken: string, pageToken?: string) {
  const drive = getDriveClient(accessToken)
  const res = await drive.files.list({
    q: "trashed=true",
    fields: "nextPageToken, files(id, name, mimeType, trashedTime, size, webViewLink)",
    pageSize: 100,
    pageToken,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  })
  return res.data
}

export async function restoreFile(accessToken: string, fileId: string) {
  const drive = getDriveClient(accessToken)
  await drive.files.update({
    fileId,
    requestBody: { trashed: false },
    supportsAllDrives: true,
  })
}

export async function restoreFiles(accessToken: string, fileIds: string[]) {
  const results = []
  for (const id of fileIds) {
    try {
      await restoreFile(accessToken, id)
      results.push({ id, ok: true })
    } catch (e: any) {
      results.push({ id, ok: false, error: e.message })
    }
  }
  return results
}
