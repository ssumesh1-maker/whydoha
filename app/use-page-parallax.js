'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function usePageParallax(root) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    media.add({ desktop: '(min-width: 801px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions.motion) return
      const desktop = context.conditions.desktop
      const amount = desktop ? 4 : 2
      const scrub = desktop ? .65 : .3
      function depth(targets, trigger, distance, extra = {}) {
        gsap.fromTo(targets, { yPercent: -distance, scale: 1.12 }, {
          yPercent: distance, ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true, ...extra },
        })
      }
      gsap.to('.hero-media video', { yPercent: desktop ? 7 : 3, scale: desktop ? 1.04 : 1.02, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub, invalidateOnRefresh: true } })
      depth('.vision-image img', '.vision-gallery', amount)
      // Keep every collage portrait in one coordinate space, including the restored image.
      gsap.fromTo('#stories .people-parallax', { yPercent: desktop ? 2 : 1 }, { yPercent: desktop ? -2 : -1, ease: 'none', scrollTrigger: { trigger: '#stories', start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true } })
      depth('.legacy-background .cover', '#legacy', amount, {
        start: () => { const scene = ScrollTrigger.getById('legacy-experience'); return scene ? scene.start - innerHeight : 'top bottom' },
        end: () => { const scene = ScrollTrigger.getById('legacy-experience'); return scene ? scene.end + innerHeight : 'bottom top' },
      })
      // Separate depth wrappers avoid writing to the city transition's image transforms.
      depth('.city-depth', '.city-overlap-layer', amount, {
        start: () => { const scene = ScrollTrigger.getById('city-experience'); return scene ? scene.start - innerHeight : 'top bottom' },
        end: () => { const scene = ScrollTrigger.getById('city-experience'); return scene ? scene.end + innerHeight : 'bottom top' },
      })
      depth('.journey-glow img', '.journey', desktop ? 6 : 3)
      gsap.fromTo('.footer', { '--footer-depth': desktop ? '-24px' : '-10px' }, { '--footer-depth': desktop ? '24px' : '10px', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub, invalidateOnRefresh: true } })
    }, root)
    return () => media.revert()
  }, [root])
}
