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
      const scrub = desktop ? .65 : .3
      function depth(targets, trigger, distance, extra = {}, scale = 1.12) {
        gsap.fromTo(targets, { yPercent: -distance, scale }, {
          yPercent: distance, ease: 'none',
          scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true, ...extra },
        })
      }
      gsap.to('.hero-media video', { yPercent: desktop ? 7 : 3, scale: desktop ? 1.04 : 1.02, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub, invalidateOnRefresh: true } })
      // Overscan keeps the approved rounded frames filled throughout the image travel.
      root.current.querySelectorAll('.vision-photo').forEach(photo =>
        depth(photo.querySelector('img'), photo, desktop ? 7 : 3, {}, desktop ? 1.18 : 1.1))
      depth('.journey-glow img', '.journey', desktop ? 6 : 3)
      gsap.fromTo('.footer', { '--footer-depth': desktop ? '-24px' : '-10px' }, { '--footer-depth': desktop ? '24px' : '10px', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub, invalidateOnRefresh: true } })
    }, root)
    return () => media.revert()
  }, [root])
}
