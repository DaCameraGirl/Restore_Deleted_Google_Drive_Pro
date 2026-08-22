# Restore_Deleted_Google_Drive_Pro

Bulk-restore everything sitting in your Google Drive trash. One command, done.

Built for Windows PowerShell, works anywhere Python runs.

## Quick start

1. **Clone / download**
   ```powershell
   git clone https://github.com/DaCameraGirl/Restore_Deleted_Google_Drive_Pro.git
   cd Restore_Deleted_Google_Drive_Pro
   ```

2. **Install deps**
   ```powershell
   pip install -r requirements.txt
   ```

3. **Get an OAuth client file**
   - https://console.cloud.google.com/apis/credentials
   - Create Credentials → OAuth client ID → Desktop app
   - Download JSON → save as `credentials.json` in the repo folder
   - Enable Google Drive API for your project if prompted

4. **Run it**
   ```powershell
   python restore_drive_trash.py
   # or
   .\restore.ps1
   ```

First run opens a browser to authorize Drive access. Token is cached to `token.json` for future runs.

The script paginates through *all* trashed files and untrashes them, printing each filename as it goes.

```
Restored: toxcast_571.csv.gz
Restored: chembl_sparse_ts_train.csv.gz
...
Done. Restored 127 files.
```

## Options

```powershell
# dry run – list what would be restored, don't actually restore
python restore_drive_trash.py --dry-run

# filter – only restore files matching a substring
python restore_drive_trash.py --filter csv
python restore_drive_trash.py --filter ".py"
```

## Files

- `restore_drive_trash.py` – main script
- `restore.ps1` – PowerShell wrapper, auto-installs deps
- `requirements.txt` – pip deps
- `credentials.json` – **you provide this**, never committed (gitignored)
- `token.json` – OAuth cache, auto-generated, gitignored

## License

MIT
