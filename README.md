# Why Doha homepage

Next.js App Router, React, CSS and GSAP ScrollTrigger. The supplied desktop Figma frame is the visual reference. The tablet and phone layouts are responsive adaptations.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to generate the static site in `out/`. Serve that directory at the web root.

## Interaction behavior

| Section | Behavior |
| --- | --- |
| Hero | Desktop scroll parallax, a static media composition on narrow screens or when reduced motion is enabled |
| Our Ambition | Image selection with a detail dialog |
| Venues | Selectable venue map on desktop and a venue list on narrower screens |
| People and Stories | Three selectable story panels and preview dialogs |
| Legacy | Theme dots, Next control and theme detail dialog |
| Explore Doha | Culture and heritage preview dialog |
| Journey | A scroll-linked path on desktop and a vertical timeline on narrow screens |
| Footer | Local newsletter preview and back-to-top navigation |

## Integration status

The hero poster is from the Figma video layer. Campaign and story video files, the licensed Doha 2036 font, Arabic copy, external destinations, and a backend for form submissions are pending. Outfit is bundled as a font fallback. Secondary gallery states use the Figma imagery already present on the homepage with draft labels and descriptions. Forms validate the email and save the latest entry locally per form for review.

## Motion reference

The [Codrops sticky grid article](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) informed the progressive image movement. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) governs the viewport and motion preference conditions.

## First interaction pass

- Section links retain native scrolling and URL history and move keyboard focus to the destination. The hero cue supports click, touch and Enter.
- Our Ambition uses the existing Sport / People / Culture / Doha image gallery, with React selection, an active outline and a selection announcement. Selecting an image retains focus on that button and updates the existing detail CTA. The supplied app and frame have no People / Sport / Reach / Legacy story index, so no new copy or index was added.
- The Figma motion nodes (76:651 and 76:652) belong to Back to top. The original exported outline geometry now draws on the four-second Figma timeline, with a synchronized floating arrow. The hero's original scroll cue also floats subtly. Motion is disabled with prefers-reduced-motion; the full static vectors remain visible.
- Controls have hover, focus and press feedback. Coarse-pointer footer links have 44px touch targets. Existing GSAP effects remain scoped to desktop visitors without reduced motion. No pinning, scroll replacement or 3D sequence was added.

### Review checklist

1. Click, tap or focus the hero cue and press Enter: Our Ambition scrolls into view and receives focus.
2. Select each ambition image using Tab and Enter or touch: the active image and detail dialog agree, and focus stays on the selected image control.
3. Follow navigation, search results, Get updates and Back to top. On a phone, open Menu, select a section, and confirm it closes.
4. Open a CTA dialog and close with Escape: focus returns to its trigger. Try the interest and newsletter forms; they store a local preview only.
5. Enable reduced motion: links navigate immediately, image controls remain usable, and decorative loops and GSAP scroll effects stop.

### Validation

Production static export passes. Chromium browser checks pass at desktop 1440×1000, emulated iPhone 13 touch 390×664, and desktop with reduced motion. Checks cover cue Enter/touch activation, selection and focus retention, modal Escape and focus restoration, mobile menu, search navigation, forms, anchor destinations, image decoding and horizontal overflow. Touch is emulated; physical-device Safari testing remains pending.

Remaining integrations are unchanged: campaign/story video, licensed font, Arabic translation, approved external/social/legal destinations and submission backend. These controls retain their honest preview dialogs. This is a local preview, not a deployed site.
