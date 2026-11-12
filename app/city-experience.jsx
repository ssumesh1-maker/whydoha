'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const scenes = [
  { title: 'Culture & Heritage', file: '36e04.png', alt: 'A Qatari souq at golden hour' },
  { title: 'City life', file: 'city-life.png', alt: 'People walking and cycling beside Doha’s waterfront skyline' },
  { title: 'Nature & outdoors', file: 'nature-outdoors.png', alt: 'A family walking beside mangroves overlooking Doha’s skyline' },
  { title: 'Food & lifestyle', file: 'food-lifestyle.png', alt: 'A family sharing a meal at an outdoor restaurant in Doha' },
]

export default function CityExperience({ children, renderAction }) {
  const section = useRef(null)
  const scrollSequence = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    // Warm all four images before the section arrives, including hidden layers.
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      section.current.querySelectorAll('img').forEach(image => {
        image.loading = 'eager'
        image.decode().catch(() => {})
      })
      observer.disconnect()
    }, { rootMargin: '200% 0px' })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    // Short screens use the same direct controls without trapping an oversized card.
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 620px)', () => {
      const layer = section.current.parentElement
      layer.style.setProperty('--city-scene-count', String(scenes.length))
      layer.style.setProperty('--city-stage-height', section.current.offsetHeight + 'px')
      layer.classList.add('city-scroll-enabled')
      const backgrounds = section.current.querySelectorAll('.city-backgrounds .city-scene')
      const thumbnails = section.current.querySelectorAll('.city-thumbnails .city-scene')
      // Keep a solid first layer underneath every wipe. No visibility toggles at
      // scene boundaries: reverse/fast scroll always reveals an existing image.
      const frames = [...backgrounds, ...thumbnails]
      gsap.set(frames, { autoAlpha: 1, yPercent: 0 })
      backgrounds.forEach((frame, i) => gsap.set(frame, { zIndex: i }))
      thumbnails.forEach((frame, i) => gsap.set(frame, { zIndex: i }))
      gsap.set(frames.map(frame => frame.querySelector('.city-inner')), { yPercent: 0 })
      const timeline = gsap.timeline({ defaults: { duration: 1, ease: 'power1.inOut' } })
      timeline.addLabel('scene-0', 0)
      scenes.slice(1).forEach((_, offset) => {
        const i = offset + 1
        const start = .5 + offset * 1.5
        const frames = [backgrounds[i], thumbnails[i]]
        const inners = frames.map(frame => frame.querySelector('.city-inner'))
        gsap.set(frames, { yPercent: 100 })
        gsap.set(inners, { yPercent: -100 })
        timeline.fromTo(frames, { yPercent: 100 }, { yPercent: 0 }, start)
          .fromTo(inners, { yPercent: -100 }, { yPercent: 0 }, start)
          .addLabel('scene-' + i, start + 1)
      })
      timeline.to({}, { duration: .5 })
      // Derive labels from the rendered animation, not an independently lagging
      // scroll position. The stage/card and images stay in the same scroll frame.
      timeline.eventCallback('onUpdate', () => {
        let index = 0
        scenes.forEach((_, i) => { if (timeline.time() >= timeline.labels['scene-' + i] - .01) index = i })
        setActive(current => current === index ? current : index)
      })
      const sequence = ScrollTrigger.create({
        id: 'city-experience',
        trigger: layer,
        animation: timeline,
        start: () => {
          const legacy = ScrollTrigger.getById('legacy-experience')
          return legacy && section.current.closest('.legacy-city-overlap') ? legacy.end : 'top top'
        },
        end: () => '+=' + section.current.offsetHeight * (scenes.length - 1),
        scrub: true,
        invalidateOnRefresh: true,
      })
      scrollSequence.current = { trigger: sequence, timeline }
      let refreshFrame
      let previousHeight = section.current.offsetHeight
      const resize = new ResizeObserver(() => {
        const height = section.current.offsetHeight
        if (height === previousHeight) return
        previousHeight = height
        layer.style.setProperty('--city-stage-height', height + 'px')
        cancelAnimationFrame(refreshFrame)
        refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      resize.observe(section.current)
      return () => {
        scrollSequence.current = null
        resize.disconnect()
        cancelAnimationFrame(refreshFrame)
        layer.classList.remove('city-scroll-enabled')
        layer.style.removeProperty('--city-stage-height')
        layer.style.removeProperty('--city-scene-count')
      }
    })
    return () => media.revert()
  }, [])

  function selectScene(index) {
    const sequence = scrollSequence.current
    if (sequence) {
      // Native scroll ownership, no wheel/touch interception or forced smooth scrolling.
      const progress = sequence.timeline.labels['scene-' + index] / sequence.timeline.duration()
      window.scrollTo({ top: sequence.trigger.start + progress * (sequence.trigger.end - sequence.trigger.start), behavior: 'instant' })
    }
    setActive(index)
  }

  const scene = scenes[active]
  return <section ref={section} tabIndex={-1} id="explore" className="explore city-experience" aria-labelledby="explore-title">
    <div className="city-backgrounds" aria-hidden="true">
      {scenes.map((item, index) => <div key={item.file} className={'city-scene' + (active === index ? ' is-active' : '')}><div className="city-inner"><div className="city-depth"><img src={'/media/' + item.file} alt="" decoding="async" loading={index === 0 ? 'eager' : 'lazy'} className="cover" /></div></div></div>)}
    </div>
    <div className="explore-card">
      {children}
      {renderAction(scene)}
      <div className="city-thumbnails">
        {scenes.map((item, index) => <div key={item.file} aria-hidden={active !== index} className={'city-scene' + (active === index ? ' is-active' : '')}><div className="city-inner"><div className="city-depth"><img src={'/media/' + item.file} alt={item.alt} decoding="async" loading={index === 0 ? 'eager' : 'lazy'} className="explore-thumb" /></div></div></div>)}
      </div>
      <h3 id="city-scene-title" aria-live="polite" aria-atomic="true">{scene.title}</h3>
      <div className="city-controls" role="group" aria-label="Choose a city experience">
        {scenes.map((item, index) => <button key={item.file} type="button" aria-label={item.title} aria-pressed={active === index} aria-controls="city-scene-title" onClick={() => selectScene(index)}><span aria-hidden="true" /></button>)}
      </div>
    </div>
  </section>
}
