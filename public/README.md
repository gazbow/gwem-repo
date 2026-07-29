# Static assets — drop images here

Everything in this `public/` folder is served at the site root. So a file at
`public/landart-logo.png` is available at `https://your-site/landart-logo.png`.
No code change is needed after you add a file — just commit it (or drop it in the
GitHub web UI) and redeploy.

## 1. The logo

Drop the Landart logo here as:

```
public/landart-logo.png
```

- **PNG or JPG** (not SVG — the PDF generator can't embed SVG). A transparent PNG is best.
- Landscape/horizontal lockup works best in the header. Aim for ~600–1000px wide.
- It appears automatically in the site header and at the top of the emailed PDF.
  If the file is missing, both fall back to the "LANDART" text wordmark, so nothing breaks.

## 2. Garden images (the tag-matched hero image)

Drop 8–10 photos into `public/gardens/` using **exactly these filenames**. The guide
picks the best match for each visitor's answers (see `src/data/gardenImages.ts`):

```
public/gardens/coastal-native.webp    coastal, sandy, native planting
public/gardens/native-grasses.webp    full-sun native / grasses
public/gardens/modern-courtyard.webp  small structured / modern courtyard
public/gardens/modern-grounds.webp    large modern grounds
public/gardens/modern-pool.webp       modern garden with a pool
public/gardens/lush-family.webp       lush green family garden
public/gardens/lush-tropical.webp     lush / tropical, coastal
public/gardens/shaded-retreat.webp    shaded courtyard / retreat, ferns
public/gardens/entertaining.webp      entertaining-focused garden
public/gardens/default.webp           fallback used when nothing else matches
```

- **Landscape orientation**, ~1600×1000px, WebP, optimised (aim for <200KB each).
  JPEG or PNG also work if you name the files to match and update the extensions in
  `src/data/gardenImages.ts`.
- **Use Landart's own project photography** — it's on-brand, licensed, and far stronger
  than stock. Any image that doesn't load simply won't show (no broken-image icon), so
  you can add them one at a time.

To change which photo maps to which garden type, edit `src/data/gardenImages.ts`.
```
