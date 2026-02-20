# PalletScan 📦

A mobile-first warehouse pallet barcode management system built with **Next.js 14**, **PostgreSQL**, and **Drizzle ORM**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL + Drizzle ORM |
| Styling | Tailwind CSS |
| Scanner | @zxing/library |
| Excel | xlsx |
| Toasts | sonner |

---

## Project Structure

```
palletscan/
├── app/
│   ├── api/
│   │   ├── pallets/          # GET, POST /api/pallets
│   │   │   └── [id]/
│   │   │       ├── route.ts  # GET, DELETE /api/pallets/:id
│   │   │       └── items/    # GET /api/pallets/:id/items
│   │   ├── items/            # POST /api/items
│   │   ├── search/[barcode]/ # GET /api/search/:barcode
│   │   └── export/           # GET /api/export (Excel download)
│   ├── layout.tsx
│   ├── page.tsx              # Main client shell
│   └── globals.css
├── components/
│   ├── layout/
│   │   └── AppHeader.tsx     # Header + tab navigation
│   ├── views/
│   │   ├── ScanView.tsx      # Main scanning tab
│   │   ├── PalletsView.tsx   # All pallets tab
│   │   └── SearchView.tsx    # Search + stats tab
│   ├── pallets/
│   │   ├── ActivePalletCard.tsx
│   │   ├── NewPalletModal.tsx
│   │   └── PalletCard.tsx
│   ├── scanner/
│   │   ├── BarcodeScanner.tsx
│   │   ├── ManualInput.tsx
│   │   └── RecentScans.tsx
│   ├── search/
│   │   └── SearchBox.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── ProgressBar.tsx
│       ├── SectionLabel.tsx
│       └── StatCard.tsx
├── hooks/
│   ├── usePallets.ts         # Fetch + manage pallets
│   ├── useScanner.ts         # ZXing camera scanner
│   └── useScan.ts            # Scan submission logic
├── lib/
│   ├── db/
│   │   ├── index.ts          # Drizzle client singleton
│   │   ├── schema.ts         # Tables + types
│   │   └── migrations/
│   │       └── 0000_init.sql
│   └── services/
│       ├── palletService.ts  # Pallet CRUD
│       ├── itemService.ts    # Scan, duplicate check, search
│       └── exportService.ts  # Excel generation
├── .env.local                # Your DATABASE_URL goes here
├── drizzle.config.ts
├── tailwind.config.ts
└── next.config.js
```

---

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud)

### 2. Install Dependencies

```bash
cd palletscan
npm install
```

### 3. Set Up PostgreSQL

**Option A — Local PostgreSQL:**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb palletscan

# Ubuntu/Debian
sudo apt install postgresql
sudo -u postgres createdb palletscan
```

**Option B — Free Cloud (Neon.tech):**
1. Go to [neon.tech](https://neon.tech) → Create free account
2. Create a new project → Copy the connection string

**Option C — Supabase:**
1. Go to [supabase.com](https://supabase.com) → Create project
2. Settings → Database → Copy the URI connection string

### 4. Configure Environment

Edit `.env.local`:
```env
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/palletscan

# Neon
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/palletscan?sslmode=require

# Supabase
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres
```

### 5. Run Database Migration

```bash
# Push schema directly (easiest for dev)
npm run db:push

# OR run the SQL file manually in psql
psql $DATABASE_URL < lib/db/migrations/0000_init.sql
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## Mobile Access (for real warehouse use)

The camera scanner requires `https://` on mobile. Options:

**Option A — ngrok tunnel:**
```bash
npm install -g ngrok
ngrok http 3000
# Open the https:// URL on your phone
```

**Option B — Deploy to Vercel (free):**
```bash
npm install -g vercel
vercel
# Add DATABASE_URL as environment variable in Vercel dashboard
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pallets` | List all pallets with item counts |
| POST | `/api/pallets` | Create pallet `{ maxItems?: number }` |
| GET | `/api/pallets/:id` | Get single pallet |
| DELETE | `/api/pallets/:id` | Delete pallet + all items |
| GET | `/api/pallets/:id/items` | List items in a pallet |
| POST | `/api/items` | Add scanned item `{ barcode, palletId }` |
| GET | `/api/search/:barcode` | Search barcode across all pallets |
| GET | `/api/export` | Download Excel file |

### HTTP Status Codes

- `201` — Created successfully
- `400` — Invalid input
- `404` — Not found
- `409` — Duplicate barcode or pallet full
- `500` — Server error

---

## Database Management

```bash
# Visual DB browser
npm run db:studio

# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

---

## Production Build

```bash
npm run build
npm start
```
