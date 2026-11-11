'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default function useTextReveals(root) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference)')
    let context
    let targets = []
    let resizeTimer
    let stopped = false

    function update() {
      if (stopped) return
      // Only stable editorial text: React owns live slider titles and dialog content.
      const next = preference.matches ? Array.from(root.current.querySelectorAll('h1, h2, h3, p')).filter(element =>
        !element.closest('dialog, .legacy-experience, .venue-card, .story-meta, .city-experience h3, .people-intro') &&
        !element.querySelector('a, button, input, img') &&
        parseFloat(getComputedStyle(element).fontSize) > 24
      ) : []
      if (next.length === targets.length && next.every((element, index) => element === targets[index])) return
      context?.revert()
      targets = next
      context = gsap.context(() => {
        targets.forEach(element => {
          SplitText.create(element, {
            type: 'words',
            wordsClass: 'text-reveal-word',
            aria: 'auto',
            onSplit(split) {
              return gsap.from(split.words, {
                opacity: .12,
                duration: .65,
                stagger: { amount: Math.min(.9, Math.max(0, split.words.length - 1) * .045) },
                ease: 'power1.out',
                scrollTrigger: { trigger: element, start: 'top 92%', once: true },
              })
            },
          })
        })
      }, root)
      ScrollTrigger.refresh()
    }
    function resize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(update, 150)
    }
    // Measure with the actual brand font, preserving its wrapping and metrics.
    document.fonts.ready.then(update)
    const observer = new MutationObserver(update)
    observer.observe(root.current, { childList: true, subtree: true })
    preference.addEventListener('change', update)
    window.addEventListener('resize', resize)
    return () => {
      stopped = true
      observer.disconnect()
      clearTimeout(resizeTimer)
      preference.removeEventListener('change', update)
      window.removeEventListener('resize', resize)
      context?.revert()
    }
  }, [root])
}
