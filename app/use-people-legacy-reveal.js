'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function usePeopleLegacyReveal(root) {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      media.add({ motion: '(prefers-reduced-motion: no-preference)', tall: '(min-height: 620px)', desktop: '(min-width: 801px)' }, context => {
        if (!context.conditions.motion || !context.conditions.tall) return
        const stories = root.current.querySelector('#stories')
        const layer = stories.parentElement
        const container = stories.closest('main')
        const panel = stories.querySelector('.stories-panel')
        const preview = stories.querySelector('.people-legacy-preview')
        const image = preview.querySelector('img')
        const measure = () => {
          const viewport = innerHeight + 'px'
          const oldViewport = container.style.getPropertyValue('--people-reveal-viewport')
          const oldHeight = container.style.getPropertyValue('--people-reveal-height')
          container.style.setProperty('--people-reveal-viewport', viewport)
          const height = stories.offsetHeight + 'px'
          container.style.setProperty('--people-reveal-height', height)
          return viewport !== oldViewport || height !== oldHeight
        }
        container.classList.add('people-reveal-enabled')
        measure()
        image.loading = 'eager'
        image.decode().catch(() => {})
        gsap.set(stories, { autoAlpha: 1 })
        gsap.set(preview, { visibility: 'visible', '--people-aperture': '50%', '--people-radius': '24px' })
        const travel = context.conditions.desktop ? 80 : 60
        // Only the opening and outgoing text move. Photos are never transformed.
        const timeline = gsap.timeline({ defaults: { ease: 'power1.inOut' } })
        timeline.to(panel, { backgroundColor: 'rgba(255,255,255,0)', duration: .3 }, .05)
          .to(panel.querySelectorAll('.people-parallax > img'), { opacity: 0, duration: .3 }, .1)
          .to(panel.querySelector('.people-heading-row'), { xPercent: -travel, opacity: 0, duration: .5 }, 0)
          .to(panel.querySelector('.people-intro'), { xPercent: travel, opacity: 0, duration: .5 }, 0)
          .to(preview, { '--people-aperture': '0%', '--people-radius': '0px', duration: .88 }, .02)
          // The opaque preview hands off exactly when Legacy reaches the top.
          .set(stories, { autoAlpha: 0 }, 1)
        ScrollTrigger.create({
          id: 'people-legacy-reveal', trigger: layer, animation: timeline,
          start: () => layer.getBoundingClientRect().top + scrollY + stories.offsetHeight - innerHeight,
          end: () => '+=' + innerHeight,
          scrub: true, refreshPriority: 20, invalidateOnRefresh: true,
          onRefreshInit: measure,
          onUpdate: self => { panel.inert = self.progress > .2 },
        })
        let refreshFrame
        const resize = new ResizeObserver(() => {
          if (!measure()) return
          cancelAnimationFrame(refreshFrame)
          refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
        })
        resize.observe(stories)
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        return () => {
          resize.disconnect()
          cancelAnimationFrame(refreshFrame)
          panel.inert = false
          container.classList.remove('people-reveal-enabled')
          container.style.removeProperty('--people-reveal-viewport')
          container.style.removeProperty('--people-reveal-height')
        }
      }, root)
    })
    return () => { disposed = true; media.revert() }
  }, [root])
}
