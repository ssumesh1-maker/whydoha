'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

export default function usePeopleEntrance(root) {
  useEffect(() => {
    const media = gsap.matchMedia()
    const seen = new WeakSet()
    let introSeen = false
    let legacySeen = false
    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 801px)' }, context => {
        if (!context.conditions.motion) return
        const photos = [...root.current.querySelectorAll('#stories .people-parallax > img')].filter(photo => !seen.has(photo))
        const intro = root.current.querySelector('#stories .people-intro')
        const distance = context.conditions.desktop ? 18 : 12
        if (photos.length) gsap.set(photos, { y: distance, opacity: 0 })
        context.add('revealPortraits', batch => {
          batch.forEach(photo => seen.add(photo))
          gsap.to(batch, { y: 0, opacity: 1, duration: .65, stagger: .07, ease: 'power2.out', clearProps: 'transform,opacity' })
        })
        const visibility = new IntersectionObserver(entries => {
          const portraits = entries.filter(entry => entry.isIntersecting && photos.includes(entry.target)).map(entry => entry.target)
          if (portraits.length) context.revealPortraits(portraits)
          entries.forEach(entry => {
            if (!entry.isIntersecting) return
            if (entry.target === intro) introTween?.play()
            if (entry.target === legacyHeading) legacyTween?.play()
            visibility.unobserve(entry.target)
          })
        }, { threshold:.1 })
        photos.forEach(photo => visibility.observe(photo))
        const legacyHeading = root.current.querySelector('.legacy-heading')
        let legacyTween
        let introTween
        if (!introSeen) {
          introTween = gsap.from(intro, {
            y: 12, opacity: 0, duration: .55, delay: .12, ease: 'power2.out',
            clearProps: 'transform,opacity', onStart: () => { introSeen = true },
            paused:true,
          })
          visibility.observe(intro)
        }
        // Keyboard users can activate the CTA immediately, even before its entrance.
        const showIntro = () => { introSeen = true; introTween?.progress(1) }
        intro.addEventListener('focusin', showIntro)
        if (!legacySeen) {
          legacyTween = gsap.from(legacyHeading, {
            opacity: 0, duration: .5, ease: 'power1.out', clearProps: 'opacity',
            onStart: () => { legacySeen = true },
            paused:true,
          })
          visibility.observe(legacyHeading)
        }
        return () => { visibility.disconnect(); intro.removeEventListener('focusin', showIntro) }
      }, root)
    })
    return () => { disposed = true; media.revert() }
  }, [root])
}
