from supabase import create_client

SUPABASE_URL = "https://joheklcmbnoztrcrzlme.supabase.co"

SUPABASE_KEY = "sb_publishable_KrK-ZI3BUavI936bW9z7Fw_H7B7yqJh"

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)