'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Scroll is captured only while a viewport-sized gallery is aligned to the screen.
// Links, the scrollbar, keyboard page navigation and short screens remain native.
export default function useLoopingGallery(section, count, frameSelectors, innerSelector, axis) {
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(true)
  const previous = useRef(0)
  const direction = useRef(1)
  const released = useRef(false)
  const lastInput = useRef(0)
  const select = (index, step = index >= active ? 1 : -1) => {
    direction.current = step
    setActive((index + count) % count)
  }
  const selectRef = useRef(select)
  selectRef.current = select

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync(); query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useLayoutEffect(() => {
    const element = section.current
    const groups = frameSelectors.split(',').map(selector => [...element.querySelectorAll(selector)])
    const all = groups.flat()
    const from = previous.current
    previous.current = active
    if (reduced || from === active) return
    const incoming = groups.map(group => group[active])
    const outgoing = groups.map(group => group[from])
    const offset = axis === 'x' ? 'xPercent' : 'yPercent'
    const ctx = gsap.context(() => {
      gsap.set(all, { autoAlpha: 0, zIndex: 0, [offset]: 0 })
      gsap.set(outgoing, { autoAlpha: 1, zIndex: 1 })
      gsap.set(incoming, { autoAlpha: 1, zIndex: 2 })
      const inner = incoming.map(frame => frame.querySelector(innerSelector))
      const timeline = gsap.timeline({ defaults: { duration: .8, ease: 'power2.inOut' } })
      timeline.fromTo(incoming, { [offset]: 100 * direction.current }, { [offset]: 0 }, 0)
        .fromTo(inner, { [offset]: -100 * direction.current }, { [offset]: 0 }, 0)
        .set(outgoing, { autoAlpha: 0 })
    }, element)
    return () => ctx.revert()
  }, [active, reduced, section, frameSelectors, innerSelector, axis])

  useEffect(() => {
    const element = section.current
    let total = 0, lastWheel = 0, touchY = null, touchHandled = false
    const usable = () => !reduced && innerHeight >= 620 && element.offsetHeight <= innerHeight + 2 && !document.querySelector('dialog[open]')
    const align = delta => {
      if (!usable() || released.current) return false
      const box = element.getBoundingClientRect()
      if (Math.abs(box.top) <= 20 || (box.top > 0 && box.top <= delta) || (box.top < 0 && box.top >= delta)) {
        if (Math.abs(box.top) > 1) window.scrollTo({ top: scrollY + box.top, behavior: 'instant' })
        return true
      }
      return false
    }
    const step = delta => {
      const now = performance.now()
      if (now - lastInput.current < 950) return
      lastInput.current = now
      selectRef.current((previous.current + (delta > 0 ? 1 : -1) + count) % count, delta > 0 ? 1 : -1)
    }
    const wheel = event => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY || !align(event.deltaY)) return
      event.preventDefault()
      const now = performance.now()
      if (now - lastWheel > 180 || Math.sign(total) !== Math.sign(event.deltaY)) total = 0
      lastWheel = now
      total += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      if (Math.abs(total) >= 45) { step(total); total = 0 }
    }
    const touchStart = event => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null
      touchHandled = false
    }
    const touchMove = event => {
      if (touchY === null || event.touches.length !== 1) return
      const delta = touchY - event.touches[0].clientY
      if (!align(delta)) return
      event.preventDefault()
      if (!touchHandled && Math.abs(delta) >= 45) { step(delta); touchHandled = true }
    }
    const scroll = () => {
      const box = element.getBoundingClientRect()
      if (box.bottom <= 0 || box.top >= innerHeight) released.current = false
    }
    element.addEventListener('wheel', wheel, { passive: false })
    element.addEventListener('touchstart', touchStart, { passive: true })
    element.addEventListener('touchmove', touchMove, { passive: false })
    window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      element.removeEventListener('wheel', wheel)
      element.removeEventListener('touchstart', touchStart)
      element.removeEventListener('touchmove', touchMove)
      window.removeEventListener('scroll', scroll)
    }
  }, [section, count, reduced])

  const release = () => { released.current = true }
  return { active, select, release }
}
