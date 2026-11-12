'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const scenes = [
  { title: 'Culture & Heritage', file: '36e04.png', alt: 'A Qatari souq at golden hour' },
  { title: 'City life', file: 'city-life.png', alt: 'People walking and cycling beside Doha’s waterfront skyline' },
  { title: 'Nature & outdoors', file: 'nature-outdoors.png', alt: 'A family walking beside mangroves overlooking Doha’s skyline' },
  { title: 'Food & lifestyle', file: 'food-lifestyle.png', alt: 'A family sharing a meal at an outdoor restaurant in Doha' },
]

export default function CityExperience({ children, renderAction }) {
  const section = useRef(null)
  const sequence = useRef(null)
  const [active, setActive] = useState(0)
  const activeIndex = useRef(0)

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
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const backgrounds = section.current.querySelectorAll('.city-backgrounds .city-scene')
      const thumbnails = section.current.querySelectorAll('.city-thumbnails .city-scene')
      // Keep a solid first layer underneath every wipe. No visibility toggles at
      // scene boundaries: reverse/rapid selection always reveals an existing image.
      const frames = [...backgrounds, ...thumbnails]
      gsap.set(frames, { autoAlpha: 1, yPercent: 0 })
      backgrounds.forEach((frame, i) => gsap.set(frame, { zIndex: i }))
      thumbnails.forEach((frame, i) => gsap.set(frame, { zIndex: i }))
      gsap.set(frames.map(frame => frame.querySelector('.city-inner')), { yPercent: 0 })
      const timeline = gsap.timeline({ paused:true, defaults: { duration: 1, ease: 'power1.inOut' } })
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
      timeline.seek('scene-' + activeIndex.current)
      sequence.current = { timeline, tween:null }
      return () => {
        sequence.current?.tween?.kill()
        sequence.current = null
      }
    })
    return () => media.revert()
  }, [])

  function selectScene(index) {
    const current = sequence.current
    if (current) {
      current.tween?.kill()
      current.tween = current.timeline.tweenTo('scene-' + index, { duration:.75, ease:'power2.inOut' })
    }
    activeIndex.current = index
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
