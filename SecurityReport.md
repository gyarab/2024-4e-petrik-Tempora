
## 🚨 Problem

- Hardcodovany Supabase API key
- V HTML `<script>` tagu
- Public access do databaze 

---

## 🧪 Deatily

- URL: `https://kbywgzzqkptgdmdtnnpo.supabase.co`
- Klic: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Lokace: `window.__NUXT__.config.public.supabase.key`

---

## 🧬 PoC

```bash
curl -X GET "https://kbywgzzqkptgdmdtnnpo.supabase.co/rest/v1/timelines" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Obsah DB

- [📁 PoC-user_profiles.json](./PoC-user_profiles.json)  
- [📁 PoC-timelines.json](./PoC-timelines.json)  
- [📁 PoC-items.json](./PoC-items.json)

---

## ✅ Fix

- Revoknout klic
- Presunout do .env
- Nehardcodovat to do HTML D:
