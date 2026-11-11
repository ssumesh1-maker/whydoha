'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function usePeopleLegacyZoom(root) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      media.add({ motion: '(prefers-reduced-motion: no-preference)', tall: '(min-height: 620px)', desktop: '(min-width: 801px)' }, context => {
        if (!context.conditions.motion || !context.conditions.tall) return
        const stories = root.current.querySelector('#stories')
        const container = stories.parentElement
        const panel = stories.querySelector('.stories-panel')
        const portal = stories.querySelector('.people-legacy-portal')
        const fronts = portal.querySelectorAll('.telescope-front')
        const portraits = panel.querySelectorAll('.people-parallax > img')
        const heading = panel.querySelector('.people-heading-row')
        const intro = panel.querySelector('.people-intro')
        const images = portal.querySelectorAll('img')
        const measure = () => container.style.setProperty('--people-legacy-height', innerHeight + 'px')
        container.classList.add('people-legacy-zoom')
        measure()
        // A decorative preview only; Legacy's real content and controls remain unique.
        images.forEach(image => { image.loading = 'eager' })
        // Adapted from the source's six-plane zoom and perspective thumbnail motion.
        // The mask is a CSS portrait vignette; no demo bird artwork is reused.
        gsap.set(portal, { visibility: 'visible', scale: 0 })
        gsap.set(fronts, { scale: i => [1, .85, .6, .45, .3, .15][i], filter: 'blur(2px)' })
        gsap.set(portraits, { z: 0, force3D: true, backfaceVisibility: 'hidden' })
        const timeline = gsap.timeline({ defaults: { ease: 'power1.inOut' } })
        timeline.to(panel, { backgroundColor: 'rgba(255,255,255,0)', duration: .25 }, .05)
          .to(portraits, { z: () => innerHeight * .92, duration: .58, stagger: { amount: .1, from: 'center' } }, 0)
          .to(portraits, { opacity: 0, duration: .15 }, .5)
          .to(heading, { xPercent: -85, opacity: 0, duration: .5 }, 0)
          .to(intro, { xPercent: 85, opacity: 0, duration: .45 }, .05)
          .to(portal, { scale: 1, duration: .88 }, 0)
          .to(fronts, { scale: 1, duration: .55 }, .35)
          .to(fronts, { filter: 'blur(0px)', duration: .3, stagger: { amount: .125, from: 'end' } }, .52)
          .to(stories, { autoAlpha: 0, duration: .12, ease: 'none' }, .88)
        ScrollTrigger.create({
          id: 'people-legacy-zoom', trigger: stories, animation: timeline,
          start: 'bottom bottom', end: () => '+=' + innerHeight,
          pin: true, pinSpacing: true, scrub: .3, anticipatePin: 1,
          refreshPriority: 20, invalidateOnRefresh: true, onRefreshInit: measure,
          onUpdate: self => { panel.inert = self.progress > .2 },
        })
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        return () => {
          panel.inert = false
          container.classList.remove('people-legacy-zoom')
          container.style.removeProperty('--people-legacy-height')
        }
      }, root)
    })
    return () => { disposed = true; media.revert() }
  }, [root])
}
