'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let activeScroller = null

// Slide controls must cancel wheel inertia before seeking a ScrollTrigger scene.
export function scrollToPosition(top) {
  if (activeScroller) activeScroller.scrollTo(top, { immediate:true, force:true })
  else window.scrollTo({ top, behavior:'instant' })
}

export function scrollToSection(target) {
  if (!activeScroller) return false
  // An anchor can close the menu and navigate in the same React event.
  activeScroller.start()
  activeScroller.scrollTo(target, { force:true })
  return true
}

export default function useSmoothScroll(paused) {
  const instance = useRef(null)
  const pausePreference = useRef(paused)
  pausePreference.current = paused

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let dispose
    function syncMotion() {
      dispose?.()
      dispose = null
      if (preference.matches) return
      const lenis = new Lenis({
        autoRaf:false, smoothWheel:true, syncTouch:false, lerp:.1,
        prevent:node => Boolean(node.closest?.('dialog,[data-lenis-prevent],input,textarea,select')),
      })
      instance.current = activeScroller = lenis
      const tick = seconds => lenis.raf(seconds * 1000)
      const resize = () => lenis.resize()
      const cancelInertia = () => {
        if (lenis.isStopped) return
        lenis.stop()
        lenis.start()
      }
      const key = event => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.('input,textarea,select,[contenteditable="true"]')) return
        if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) cancelInertia()
      }
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      ScrollTrigger.addEventListener('refresh', resize)
      window.addEventListener('keydown', key)
      window.addEventListener('popstate', cancelInertia)
      if (pausePreference.current) lenis.stop()
      dispose = () => {
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        ScrollTrigger.removeEventListener('refresh', resize)
        window.removeEventListener('keydown', key)
        window.removeEventListener('popstate', cancelInertia)
        lenis.off('scroll', ScrollTrigger.update)
        lenis.destroy()
        if (activeScroller === lenis) activeScroller = null
        if (instance.current === lenis) instance.current = null
      }
    }
    syncMotion()
    preference.addEventListener('change', syncMotion)
    return () => { preference.removeEventListener('change', syncMotion); dispose?.() }
  }, [])

  useEffect(() => {
    if (paused) instance.current?.stop()
    else instance.current?.start()
  }, [paused])
}
