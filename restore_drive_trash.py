# restore_drive_trash.py
# Bulk-untrash everything in Google Drive
# https://github.com/DaCameraGirl/Restore_Deleted_Google_Drive_Pro

import argparse
import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/drive"]
TOKEN_FILE = "token.json"
CREDENTIALS_FILE = "credentials.json"


def get_creds():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                print(f"Missing {CREDENTIALS_FILE}\n"
                      f"Get one at: https://console.cloud.google.com/apis/credentials\n"
                      f"Create Credentials -> OAuth client ID -> Desktop app -> Download JSON -> save as {CREDENTIALS_FILE}",
                      file=sys.stderr)
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
    return creds


def main():
    parser = argparse.ArgumentParser(description="Bulk-restore trashed Google Drive files")
    parser.add_argument("--dry-run", action="store_true", help="List what would be restored, don't actually restore")
    parser.add_argument("--filter", type=str, default="", help="Only restore files whose name contains this substring (case-insensitive)")
    args = parser.parse_args()

    creds = get_creds()
    service = build("drive", "v3", credentials=creds)

    restored = 0
    skipped = 0
    errors = 0
    page_token = None
    name_filter = args.filter.lower()

    print(f"Scanning Drive trash... filter='{name_filter or '(none)'}' dry_run={args.dry_run}\n")

    while True:
        try:
            resp = service.files().list(
                q="trashed=true",
                fields="nextPageToken, files(id, name, mimeType)",
                pageSize=100,
                pageToken=page_token,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            ).execute()
        except HttpError as e:
            print(f"List error: {e}", file=sys.stderr)
            break

        for f in resp.get("files", []):
            name = f["name"]
            if name_filter and name_filter not in name.lower():
                skipped += 1
                continue
            if args.dry_run:
                print(f"[dry-run] would restore: {name}")
                restored += 1
                continue
            try:
                service.files().update(fileId=f["id"], body={"trashed": False}, supportsAllDrives=True).execute()
                print(f"Restored: {name}")
                restored += 1
            except HttpError as e:
                errors += 1
                print(f"Failed: {name} – {e}", file=sys.stderr)

        page_token = resp.get("nextPageToken")
        if not page_token:
            break

    print(f"\n{'Would restore' if args.dry_run else 'Restored'}: {restored} | Skipped: {skipped} | Errors: {errors}")


if __name__ == "__main__":
    main()
