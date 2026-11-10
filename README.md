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
| Hero | Muted autoplay campaign video, desktop scroll parallax, and a static poster for reduced motion |
| Our Ambition | Borderless image gallery advances every four seconds while visible; manual selection and detail dialog |
| Venues | Selectable venue map/list; details stay hidden until a stadium is selected |
| People and Stories | Three selectable story panels and preview dialogs |
| Legacy | Theme dots, Next control and theme detail dialog |
| Explore Doha | Culture and heritage preview dialog |
| Journey | A scroll-linked path on desktop and a vertical timeline on narrow screens |
| Footer | Local newsletter preview and back-to-top navigation |

## Integration status

The hero poster is from the Figma video layer. The campaign film also plays with sound from Watch the story. Other story video files, Arabic copy, external destinations, and a backend for form submissions are pending. Doha 2036 is bundled in Light, Regular, and Bold, with Outfit as a fallback. Secondary gallery states use the Figma imagery already present on the homepage with draft labels and descriptions. Forms validate the email and save the latest entry locally per form for review.

## Motion reference

The [Codrops sticky grid article](https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/) informed the progressive image movement. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) governs the viewport and motion preference conditions.

## First interaction pass

- Section links retain native scrolling and URL history and move keyboard focus to the destination. The hero cue supports click, touch and Enter.
- Our Ambition uses the existing Sport / People / Culture / Doha image gallery, with React selection and a selection announcement. Selecting an image retains focus on that button and updates the existing detail CTA. The supplied app and frame have no People / Sport / Reach / Legacy story index, so no new copy or index was added.
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

## Experience the city scroll sequence

Culture & Heritage → City life → Nature & outdoors → Food & lifestyle. The existing centre card stays still while a ScrollTrigger pins the full-viewport section over three viewport heights of native scrolling. Four equal progress ranges select the scene, updating the title and matching full background/card images; CSS crossfades the photographs. Reverse scrolling reverses the sequence. The final state holds before releasing into The Journey.

Four labelled, keyboard-accessible scene controls provide direct selection without moving focus. The existing Explore Doha CTA opens the active scene image/title. Images preload when the visitor approaches the section. Reduced motion and viewports under 620px tall use the same controls without pinning or animated transitions. Changing motion preferences removes the pin immediately. No wheel or touch event interception, WebGL or 3D dependency is used.

Verified against the production export in Chromium desktop, emulated iPhone, reduced motion and short landscape: all scene images decode, background/card sources match, titles advance and reverse, card stays stationary, pin releases, controls retain focus, active CTA matches, and no horizontal overflow or page errors occur. Physical-device Safari remains untested.

### Gallery and map behavior update

The hero video autoplays muted without a visible playback button; reduced motion keeps its static poster. Our Ambition advances every four seconds while visible, pausing while a gallery control has keyboard focus, on mouse hover, while a dialog is open, or while the document is hidden. Reduced motion disables automatic advancement. Selection borders and hover rings are removed; keyboard focus remains visible. Stadium details are initially absent and appear only after selecting a stadium; the evidence CTA still works before selection.
