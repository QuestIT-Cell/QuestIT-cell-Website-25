# Image and Build Performance Report

## Scope

This optimization converts all 189 local PNG/JPG/JPEG assets to WebP, updates all local image references, and keeps external Cloudinary images unchanged because they are not part of the repository build.

The source dimensions were preserved. Transparent and UI assets use lossless WebP; photographic assets use WebP quality 92 with effort 4. This keeps logos and interface graphics pixel-identical while substantially reducing photographic payloads.

## Asset results

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Local raster assets | 189 | 0 | 100% converted |
| WebP assets | 3 | 192 | +189 |
| Local image bytes | 182,281,125 bytes (182.28 MB) | 75,019,132 bytes (75.02 MB) | 107,261,993 bytes saved |
| Image payload reduction | - | - | 58.86% |
| Complete `public/` payload | - | 75,080,514 bytes (75.08 MB) | - |
| Static export (`out/`) | - | 78,421,148 bytes (74.79 MB) | - |

The existing 3 WebP assets were included in the final totals. The generated files retain the original filenames and directory structure, with only the extension changed.

## Build timing

The project has one build pipeline: `npm run build` runs `next build` and produces the responsive static export used by desktop, mobile, and the PWA/app experience. There are no separate PC, mobile, or native-app compilation targets in `package.json`, so each target uses the same build artifact.

| Target | Before | After | Difference |
| --- | ---: | ---: | ---: |
| PC / desktop | 3.93 s | 4.08 s average | +0.15 s (+3.8%) |
| Mobile web | 3.93 s | 4.08 s average | +0.15 s (+3.8%) |
| PWA / app experience | 3.93 s | 4.08 s average | +0.15 s (+3.8%) |

### Measurement method

- Baseline: one clean `npm run build` measurement captured immediately before asset conversion.
- Optimized result: three consecutive `npm run build` measurements: 4.33 s, 4.01 s, and 3.91 s; average 4.08 s.
- Build timing is CPU/cache dependent. The 0.15-second change is within normal run-to-run variation and is not caused by a new build step.
- WebP files are static assets and are not re-encoded by the Next.js build. Therefore, image conversion improves transfer and storage costs without increasing compilation work.

## Quality and compatibility

- Source image dimensions are unchanged.
- Transparent assets use lossless WebP.
- Photographic assets use high-quality WebP encoding (quality 92).
- PWA manifest icons and structured-data image references now point to WebP files.
- Remote Cloudinary URLs remain unchanged and continue to use their provider-managed formats.
- `npm run lint` passed.
- `npm run build` passed.
- All concrete local WebP references were checked against files in `public/`.

## Conclusion

The build pipeline is already fast and WebP conversion does not provide a meaningful compilation-time reduction because public assets are copied rather than processed during `next build`. The measurable optimization is the 58.86% reduction in local image bytes, which improves initial downloads, repeat visits, mobile data usage, and static hosting costs while preserving dimensions and using lossless encoding where transparency or UI fidelity matters.

## Runtime performance remediation

The supplied audit identified a 3.5 s FCP, 7.2 s LCP, 190 ms TBT, render-blocking requests, forced reflow, and approximately 63 KiB of unused JavaScript. The following changes address the highest-impact causes:

- Removed the hydration-only loader gate from `ClientLayout`. The server-rendered home content is now visible immediately instead of waiting for the first client effect.
- Split the About, Events, Testimonials, and Contact sections into deferred client chunks so their chart, animation, and canvas code is not part of the critical home interaction path.
- Deferred Google Tag Manager by 2.5 seconds so analytics does not compete with first paint or LCP discovery.
- Removed unnecessary footer image priority and lazy-loaded the below-the-fold footer logo.
- Removed priority from the secondary Genesis logo image; the banner remains the only hero image prioritized for discovery.
- Disabled automatic Poppins font preloads to avoid preloading font variants before they are needed.
- Added mobile/tablet-sized WebP variants for the oversized Vibe W Quest, Bridge the Gap, QuestIT logo, and Genesis logo assets. Event cards now use the smaller variants while full-resolution assets remain available for modal views.
- Removed the Gallery carousel's external Google Fonts `@import`, which was creating an additional render-blocking network dependency. The carousel now uses local system fallback stacks for its display and monospace text.

Production-export verification after these changes showed first contentful paint at approximately 40–90 ms on the local profiling server, with Google Tag Manager absent during the first 500 ms and loaded after the intentional delay. Local timings are directional only and do not replace a deployed Lighthouse run on the target hosting/CDN.
