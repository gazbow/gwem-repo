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
public/gardens/coastal-native.jpg     coastal, sandy, native planting
public/gardens/native-grasses.jpg     full-sun native / grasses
public/gardens/modern-courtyard.jpg   small structured / modern courtyard
public/gardens/modern-grounds.jpg     large modern grounds
public/gardens/modern-pool.jpg        modern garden with a pool
public/gardens/lush-family.jpg        lush green family garden
public/gardens/lush-tropical.jpg      lush / tropical, coastal
public/gardens/shaded-retreat.jpg     shaded courtyard / retreat, ferns
public/gardens/entertaining.jpg       entertaining-focused garden
public/gardens/default.jpg            fallback used when nothing else matches
```

- **Landscape orientation**, ~1600×1000px, optimised (aim for <300KB each).
- **Use Landart's own project photography** — it's on-brand, licensed, and far stronger
  than stock. Any image that doesn't load simply won't show (no broken-image icon), so
  you can add them one at a time.

To change which photo maps to which garden type, edit `src/data/gardenImages.ts`.
```
