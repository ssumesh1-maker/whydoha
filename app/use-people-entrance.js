'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function usePeopleEntrance(root) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
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
        if (photos.length) ScrollTrigger.batch(photos, { start: 'top 92%', once: true, onEnter: batch => context.revealPortraits(batch) })
        let introTween
        if (!introSeen) {
          introTween = gsap.from(intro, {
            y: 12, opacity: 0, duration: .55, delay: .12, ease: 'power2.out',
            clearProps: 'transform,opacity', onStart: () => { introSeen = true },
            scrollTrigger: { trigger: intro, start: 'top 88%', once: true },
          })
        }
        // Keyboard users can activate the CTA immediately, even before its entrance.
        const showIntro = () => { introSeen = true; introTween?.progress(1) }
        intro.addEventListener('focusin', showIntro)
        if (!legacySeen) {
          gsap.from(root.current.querySelector('.legacy-heading'), {
            opacity: 0, duration: .5, ease: 'power1.out', clearProps: 'opacity',
            onStart: () => { legacySeen = true },
            scrollTrigger: { trigger: '#legacy', start: 'top 88%', once: true },
          })
        }
        return () => intro.removeEventListener('focusin', showIntro)
      }, root)
    })
    return () => { disposed = true; media.revert() }
  }, [root])
}
