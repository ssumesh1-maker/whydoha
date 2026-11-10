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
