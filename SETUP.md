# AlumPro Product Gallery — Setup Guide

## Overview

This is a full-featured PWA product gallery for aluminum balustrade pipes and accessories, with:
- Staff-facing gallery with real-time search
- Admin dashboard for product management
- Offline capability via Service Worker
- PWA installable on mobile devices

---

## 1. Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 2. Deploy to Netlify (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Connect to Netlify
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Select your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy site"

### Step 3: Enable Netlify Identity (for CMS)
1. Go to Site Settings → Identity
2. Click "Enable Identity"
3. Under Registration, select "Invite only"
4. Under Services → Git Gateway, click "Enable Git Gateway"

### Step 4: Update CMS Config
Edit `public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: YOUR_USERNAME/YOUR_REPO
  branch: main
```

### Step 5: Invite Admin Users
1. Identity → Invite users
2. Enter admin email addresses
3. Admins accept invite and set password

---

## 3. Access Admin Dashboard

### Built-in Admin (No auth, local storage)
- URL: `/admin`
- Features: Add, edit, delete products
- Data stored in browser localStorage
- Note: Changes are local only

### Netlify CMS (GitHub-backed, auto-deploy)
- URL: `/admin/` (the CMS admin)
- Login with Netlify Identity
- Changes commit to GitHub → triggers Netlify rebuild
- Products stored in `/public/content/products/` as JSON files

---

## 4. Managing Products

### Via Built-in Admin Dashboard
1. Go to `/admin`
2. Click "Add Product"
3. Fill in name, upload image, select category, add tags
4. Click "Add Product" to save

### Via Netlify CMS
1. Go to `/admin/`
2. Login with your Netlify Identity credentials
3. Click "Products" collection
4. Click "New Product"
5. Fill in details, upload image
6. Click "Publish" — this commits to GitHub and triggers a rebuild

---

## 5. Product Data Format

Products are stored in `public/products.json`:
```json
[
  {
    "id": "unique-id",
    "name": "Round Aluminum Pipe 48mm",
    "image": "/images/product-photo.jpg",
    "category": "Pipes",
    "tags": ["round", "48mm", "pipe", "aluminum"],
    "description": "Optional product description"
  }
]
```

---

## 6. Replacing the Logo

1. Prepare your logo image (recommended: 200x200px PNG)
2. Replace `/public/images/logo.png` with your file
3. The header will automatically display the new logo

---

## 7. PWA Installation

On mobile (Android/iOS):
1. Open the site in Chrome/Safari
2. Tap the browser menu
3. Select "Add to Home Screen"
4. The app installs like a native app

---

## 8. Offline Usage

After the first visit, the app caches:
- All HTML, CSS, JavaScript
- Product data (products.json)
- Product images

Staff can use the gallery fully offline after initial load.

---

## File Structure

```
/
├── public/
│   ├── images/          # Product images + logo.png
│   ├── icons/           # PWA icons
│   ├── admin/
│   │   ├── index.html   # CMS setup page
│   │   └── config.yml   # Netlify CMS configuration
│   ├── products.json    # Product data
│   ├── manifest.json    # PWA manifest
│   └── service-worker.js
├── src/
│   ├── pages/
│   │   ├── Gallery.tsx  # Staff product gallery
│   │   └── Admin.tsx    # Admin dashboard
│   ├── components/      # UI components
│   ├── hooks/           # Data hooks
│   └── types.ts         # TypeScript types
└── SETUP.md
```
