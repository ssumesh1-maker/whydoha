'use client'

import { useEffect } from 'react'

export default function useJourneyConnection(root) {
  useEffect(() => {
    const journey = root.current.querySelector('#journey')
    const item = journey.querySelector('.milestones li:nth-child(2)')
    const milestones = item.parentElement
    const wave = journey.querySelector('.journey-line img')
    const marker = item.querySelector('.milestone-marker')
    const controller = new AbortController()
    const properties = ['--engagement-marker-top','--engagement-connector-height','--engagement-marker-shift']
    let observer, frame, disposed = false
    async function connect() {
      const response = await fetch(wave.getAttribute('src'), { signal:controller.signal })
      if (!response.ok) return
      const svg = new DOMParser().parseFromString(await response.text(), 'image/svg+xml')
      const path = svg.querySelector('path')
      const [, , width, height] = svg.documentElement.getAttribute('viewBox').split(/\s+/).map(Number)
      const length = path.getTotalLength()
      await Promise.all([document.fonts.ready, wave.decode().catch(() => {})])
      if (disposed) return
      function measure() {
        if (innerWidth <= 800) {
          properties.forEach(name => item.style.removeProperty(name))
          return
        }
        const image = wave.getBoundingClientRect()
        const group = milestones.getBoundingClientRect()
        const center = group.left + item.offsetLeft + item.offsetWidth / 2
        const target = (center - image.left) / image.width * width
        let low = 0, high = length
        for (let i = 0; i < 24; i++) {
          const middle = (low + high) / 2
          if (path.getPointAtLength(middle).x < target) low = middle
          else high = middle
        }
        const point = path.getPointAtLength((low + high) / 2)
        // Use layout offsets, so the card's entrance transform cannot shift the anchor.
        const top = image.top + point.y / height * image.height - group.top - item.offsetTop - marker.offsetWidth / 2
        item.style.setProperty('--engagement-marker-top', top + 'px')
        item.style.setProperty('--engagement-marker-shift', '0%')
        item.style.setProperty('--engagement-connector-height', Math.max(0, top - item.offsetHeight + 1) + 'px')
      }
      const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
      observer = new ResizeObserver(schedule)
      observer.observe(journey)
      observer.observe(item)
      observer.observe(wave)
      measure()
    }
    connect().catch(() => {})
    return () => {
      disposed = true
      controller.abort()
      observer?.disconnect()
      cancelAnimationFrame(frame)
      properties.forEach(name => item.style.removeProperty(name))
    }
  }, [root])
}
