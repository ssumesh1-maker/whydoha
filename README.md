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
| People and Stories | Figma portrait collage with Meet the People preview dialog |
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

### Stadium detail toggle and placement

Selecting the active stadium again closes its card. On desktop the card anchors beside the selected marker, flips left when there is insufficient room on the right, and stays within map bounds. ResizeObserver recalculates placement as images load and the map/card resize. The pointer follows the selected marker. On narrower screens the card remains in the responsive venue layout. Mouse, touch and Enter toggling preserve focus on the stadium control; aria-expanded reflects visibility.

Production build and Chromium desktop, emulated touch and reduced-motion checks pass across all five stadiums for open/close toggling, focus retention, marker-relative placement and card bounds.

### Page scroll animation

GSAP ScrollTrigger reveals section content with small eased vertical movement as it enters view. Desktop uses 24px / 850ms reveals, mobile uses 12px / 550ms; text stays at least 65% opaque throughout and returns to its original styles on completion. Hero parallax, story backdrop and journey-line drawing use smooth scrub catch-up. The city pin container and map geometry are excluded from reveal transforms.

This animates content during native scrolling; it does not add scroll inertia or replace wheel/touch handling. Existing smooth native anchor navigation remains. Reduced motion disables the new reveals and scrubbing and reverts their styles immediately when the preference changes. Font family, weights, line heights and letter spacing are unchanged. No dependencies were added.

### People & Stories alignment and autoplay

The large background word stays centred horizontally on the page and vertically behind the story card; its previous scroll-linked vertical offset is removed. Athletes, Community and Culture advance every four seconds while the story stage is visible. Images, card labels, background word and active dot update together using React state and the existing CSS fade. Mouse hover over the stage, keyboard focus within the carousel, open dialogs, hidden tabs and reduced motion suspend automatic advancement. Manual dots remain available and retain focus. Typography weights, line heights and letter spacing are unchanged.

### Progressive large-text fades

Headings and body copy with a rendered font size strictly above 24px receive a staggered word-opacity reveal using GSAP SplitText and ScrollTrigger. Words fade from 12% to full opacity without translation, with a maximum 900ms stagger spread. The rendered size is checked after fonts load and when the viewport resizes. Larger changing legacy titles are picked up when their content changes. Small controls, decorative background words and modal text are excluded.

SplitText preserves an accessible text label, and reduced motion restores the original unsplit markup immediately. Font family, weight, size, line height and letter spacing are unchanged; words wrap naturally. No CSS hides content before JavaScript loads. Existing parent text reveals are removed to avoid doubling the effect.

The noho.ink reference could not be loaded from this environment; the chosen effect follows the user's clarification: words fade in progressively. Production build and Chromium desktop/mobile/reduced-motion checks pass for size threshold, responsive changes, dynamic titles, accessible labels, cleanup, progressive opacity and unchanged typography.

## Legacy & Impact continuous scenes

Replaces the former split-column card with full-viewport Community, Sport and Culture scenes, retaining the existing images, copy and detail CTA. Inspired by the supplied GSAP Observer demo: opposing clipped outer/inner wrappers create a continuous horizontal reveal, backgrounds shift gently, and SplitText characters reveal into each incoming title. Scoped styles retain Doha 2036 typography and avoid the demo's global fixed-section rules.

The adaptation uses native scrolling plus a finite ScrollTrigger pin over two viewport heights, rather than the demo's global preventDefault Observer/infinite loop. Scroll backward to reverse; after Culture the page releases into Experience the City. Numbered theme controls and Next provide keyboard/touch selection with focus retained, and the CTA follows the selected theme. Reduced motion and screens shorter than 620px use direct controls without pinning, image motion or split text. The page-level word-fade hook excludes this section to avoid double splitting.

Production build passes. Chromium desktop, emulated iPhone touch, reduced-motion and short-landscape checks pass for all three scenes, reverse selection, image loading, focus, matching detail dialogs, pin/release, downstream city selection, preference-change cleanup and horizontal overflow. Physical-device Safari remains untested.

### Transition direction update

Legacy & Impact now uses horizontal opposing wrappers, background movement and title entry. Experience the City uses the vertical opposing-wrapper transition for both its full-screen background and the image inside its fixed card. Both image layers share the same GSAP timeline and progress, including reverse scrolling. Scene titles and controls follow the completed scene. Reduced motion and short-screen fallbacks remain manual and unanimated.

Production build and desktop/mobile/reduced-motion/short-landscape checks pass. Mid-transition browser checks verify horizontal-only Legacy motion and matching vertical progress for city background and thumbnail, while the card frame stays stationary.

### Legacy-to-city overlap

After the horizontal Legacy scenes, Culture holds behind the page for one additional viewport of native scrolling. Experience the City rises from below on a higher layer until it completely covers Legacy; its vertical image sequence then begins. Scrolling backward reverses the overlap. The final Legacy controls leave the focus order while covered. Typography and media remain unchanged.

The city sequence starts at the Legacy pin's end; its stage uses native CSS sticky positioning for stable scrolling. Reduced motion and short screens remove the overlap and use the existing direct-control layouts. Production build and Chromium desktop, emulated iPhone and reduced-motion checks pass for half-overlap geometry/layer hit testing, Culture hold, city handoff, reverse scroll and preference-change cleanup.

### City scroll stability fix

Replaces the city's per-frame transform pin with native CSS sticky positioning. GSAP controls only the image timeline; it no longer counter-translates the entire section while the browser scrolls. A stable outer scroll track reserves the same four-scene distance. ResizeObserver updates track height only when the actual stage height changes, and reduced motion/short screens remove the track and sticky behavior. The Legacy overlap and direct scene controls are preserved.

Production build and overlap regression checks pass. Chromium desktop and emulated iPhone checks sample 90 animation frames in forward/reverse scrolling to verify a stationary stage/card without a JavaScript pin transform. Physical-device Safari remains untested.

## People Behind the Bid — updated Figma design

Replaces the former story slider with the updated composition from Figma page 76:2, section 97:59: a left-aligned heading, a right-side introduction and Meet the People button, followed by the organic portrait collage. The collage is the exact exported static artwork from Figma node 97:75, preserving the authored masks, imagery, cropping and image slots; UI text and the button remain native HTML. It is stored locally at public/media/people-collage.png (1309×793, approximately 1 MB), with reserved dimensions and descriptive alt text. No temporary Figma URLs are used at runtime.

At 1920px, section heading typography is Doha 2036 Regular 48/56px; body copy is Light 32/38.077px; eyebrow is Light 18/24px with 4.5px letter spacing. Mobile stacks the heading and introduction above the complete collage. The former slider autoplay, giant background word and pagination dots are removed to match the new design. Meet the People uses the existing accessible preview dialog until a destination is supplied.

Production build and Chromium desktop/mobile/reduced-motion checks pass for artwork loading, layout, exact desktop typography, keyboard/touch CTA activation, Escape/focus restoration and horizontal overflow. Existing city reverse-image behavior is retained.

### Missing volunteer portrait restored

The bottom-left volunteer portrait is now included as its own exact masked Figma export (node 109:1453) and positioned relative to the collage at x=22.4005%, y=70.4461%, width=15.6322%. This preserves alignment when the collage scales. The complete composition is reused in the Meet the People preview, so the image is visible there too. Production build and Chromium desktop, emulated touch and reduced-motion checks pass for portrait loading, reference placement, preview rendering, focus restoration and overflow.

## Page-wide GSAP parallax

Uses GSAP ScrollTrigger with eased scrub on separate imagery layers: hero video, ambition images, the complete people collage, Legacy backgrounds, synchronized city background/card depth wrappers, journey glow and footer gradient. Desktop uses gentle 4% image travel, mobile 2%; the collage moves as one group so the restored volunteer portrait keeps its relative placement. Text typography and interactive control geometry stay unchanged.

Depth wrappers are separate from horizontal/vertical scene transition targets, and the city stage remains native CSS sticky. Images use small overscan to prevent exposed edges. There is no replacement scroller, input interception or new dependency. Reduced motion disables parallax and reverts all added transforms/custom properties immediately.

Production build and Chromium desktop/emulated iPhone/reduced-motion checks pass for parallax movement, collage alignment, preference-change cleanup, overflow, city image reversal and Legacy overlap. The 90-frame city stability check still reports 0px card drift. Physical-device Safari remains untested.


## Native ScrollTrigger sequences restored

Legacy returns to its finite horizontal ScrollTrigger sequence. Experience the City returns to its stable native sticky stage with a finite vertical sequence and synchronized card imagery. Native scrolling continues into the next section; there are no wheel/touch handlers or infinite-gallery exits. The previous Legacy/City overlap and reversed first-image baseline are restored.

Page-wide ScrollTrigger parallax remains active on supported imagery. All three Our Ambition photos now use a clearer 7% image travel with 1.18 overscan on desktop, reduced to 3% and 1.1 on mobile. Rounded frames and text stay stationary. Reduced motion reverts these transforms and keeps direct scene controls usable.

The Figma Journey fixes remain: white dotted arrow surround, dotted card-to-circle connectors, and the visible curve behind milestone circles.
