'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// Keep the document, anchors, history and scrollbar native. Only directional
// wheel/swipe/key gestures choose a single adjacent full-screen destination.
export default function useFullPageScroll(root) {
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
    const panels = [...root.current.querySelectorAll('.hero,#vision,#venues,#stories,#legacy,#explore,#journey,#updates')]
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let positions = [], active = 0, tween, moving = false
    let wheelAt = -Infinity, wheelTotal = 0, wheelUsed = false, localWheel = false
    let touch, resizeFrame
    const measure = () => { positions = panels.map(panel => panel.getBoundingClientRect().top + scrollY) }
    const nearest = () => positions.reduce((best, top, index) => Math.abs(top - scrollY) < Math.abs(positions[best] - scrollY) ? index : best, 0)
    const blocked = target => Boolean(document.querySelector('dialog[open],.main-nav.open') || target?.closest('input,textarea,select,[contenteditable="true"]'))
    function scrollable(target, direction) {
      let node = target instanceof Element ? target : null
      while (node && node !== root.current) {
        if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 2 &&
          (direction > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 2 : node.scrollTop > 2)) return node
        node = node.parentElement
      }
      return null
    }
    function finish() {
      moving = false
      document.documentElement.classList.remove('section-moving')
    }
    function go(index, keyboard = false) {
      if (moving) return
      measure()
      const next = Math.max(0, Math.min(panels.length - 1, index))
      active = next
      moving = true
      document.documentElement.classList.add('section-moving')
      tween = gsap.to(window, {
        scrollTo:{ y:positions[next], autoKill:false }, duration:preference.matches ? 0 : .7,
        ease:'power2.inOut', overwrite:true,
        onComplete:() => {
          finish()
          if (keyboard) panels[next].focus({ preventScroll:true })
        },
        onInterrupt:finish,
      })
    }
    function wheel(event) {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || blocked(event.target)) return
      const now = performance.now()
      const amount = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1)
      if (!amount) return
      if (now - wheelAt > 220) { wheelUsed = false; localWheel = false; wheelTotal = 0 }
      wheelAt = now
      if (localWheel) return
      if (moving || wheelUsed) { event.preventDefault(); return }
      if (scrollable(event.target, Math.sign(amount))) { localWheel = true; return }
      event.preventDefault()
      wheelTotal += amount
      if (Math.abs(wheelTotal) < 28) return
      wheelUsed = true
      go(nearest() + Math.sign(wheelTotal))
    }
    function touchStart(event) {
      if (event.touches.length !== 1 || blocked(event.target)) { touch = null; return }
      const finger = event.touches[0]
      // Leave browser back/forward edge gestures alone.
      if (finger.clientX < 20 || finger.clientX > innerWidth - 20) { touch = null; return }
      touch = { x:finger.clientX, y:finger.clientY, target:event.target, used:false, local:false }
    }
    function touchMove(event) {
      if (!touch || event.touches.length !== 1) { touch = null; return }
      const dx = touch.x - event.touches[0].clientX, dy = touch.y - event.touches[0].clientY
      if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 6) return
      if (touch.local) return
      if (!touch.used && scrollable(touch.target, Math.sign(dy))) { touch.local = true; return }
      if (event.cancelable) event.preventDefault()
      if (touch.used || moving || Math.abs(dy) < 32) return
      touch.used = true
      go(nearest() + Math.sign(dy))
    }
    const touchEnd = () => { touch = null }
    function key(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || blocked(event.target)) return
      const directions = { ArrowDown:1, ArrowUp:-1, PageDown:1, PageUp:-1, ' ':event.shiftKey ? -1 : 1 }
      if (!(event.key in directions) && !['Home','End'].includes(event.key)) return
      if (event.key === ' ' && event.target.closest('a,button,summary,[role="button"]')) return
      event.preventDefault()
      if (event.repeat || moving) return
      const direction = directions[event.key]
      const local = direction && scrollable(event.target === document.body ? panels[nearest()] : event.target, direction)
      if (local) {
        local.scrollBy({ top:direction * (event.key.startsWith('Arrow') ? 80 : local.clientHeight * .8), behavior:preference.matches ? 'instant' : 'smooth' })
        return
      }
      go(event.key === 'Home' ? 0 : event.key === 'End' ? panels.length - 1 : nearest() + direction, true)
    }
    const sync = () => { if (!moving) active = nearest() }
    function resize() {
      cancelAnimationFrame(resizeFrame)
      tween?.kill()
      resizeFrame = requestAnimationFrame(() => {
        measure()
        window.scrollTo({ top:positions[active], behavior:'instant' })
      })
    }
    function motionChange() {
      if (!preference.matches || !moving) return
      tween?.progress(1)
    }
    measure(); active = nearest()
    window.addEventListener('wheel', wheel, { passive:false })
    window.addEventListener('touchstart', touchStart, { passive:true })
    window.addEventListener('touchmove', touchMove, { passive:false })
    window.addEventListener('touchend', touchEnd, { passive:true })
    window.addEventListener('touchcancel', touchEnd, { passive:true })
    window.addEventListener('keydown', key)
    window.addEventListener('scroll', sync, { passive:true })
    window.addEventListener('resize', resize)
    preference.addEventListener('change', motionChange)
    return () => {
      tween?.kill(); cancelAnimationFrame(resizeFrame); finish()
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('touchstart', touchStart)
      window.removeEventListener('touchmove', touchMove)
      window.removeEventListener('touchend', touchEnd)
      window.removeEventListener('touchcancel', touchEnd)
      window.removeEventListener('keydown', key)
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', resize)
      preference.removeEventListener('change', motionChange)
    }
  }, [root])
}
