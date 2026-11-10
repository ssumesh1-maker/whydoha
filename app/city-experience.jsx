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
      section.current.querySelectorAll('img').forEach(image => { image.loading = 'eager' })
      observer.disconnect()
    }, { rootMargin: '100% 0px' })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    // Short screens use the same direct controls without trapping an oversized card.
    media.add('(prefers-reduced-motion: no-preference) and (min-height: 620px)', () => {
      const sequence = ScrollTrigger.create({
        id: 'city-experience',
        trigger: section.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * (scenes.length - 1),
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => setActive(Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length))),
      })
      scrollSequence.current = sequence
      return () => { scrollSequence.current = null }
    })
    return () => media.revert()
  }, [])

  function selectScene(index) {
    const sequence = scrollSequence.current
    if (sequence) {
      // Native scroll ownership, no wheel/touch interception or forced smooth scrolling.
      const progress = index === 0 ? 0 : (index + .5) / scenes.length
      window.scrollTo({ top: sequence.start + progress * (sequence.end - sequence.start), behavior: 'instant' })
    }
    setActive(index)
  }

  const scene = scenes[active]
  return <section ref={section} tabIndex={-1} id="explore" className="explore city-experience" aria-labelledby="explore-title">
    <div className="city-backgrounds" aria-hidden="true">
      {scenes.map((item, index) => <img key={item.file} src={'/media/' + item.file} alt="" decoding="async" loading="lazy" className={'cover city-scene' + (active === index ? ' is-active' : '')} />)}
    </div>
    <div className="explore-card">
      {children}
      {renderAction(scene)}
      <div className="city-thumbnails">
        {scenes.map((item, index) => <img key={item.file} src={'/media/' + item.file} alt={item.alt} aria-hidden={active !== index} decoding="async" loading="lazy" className={'explore-thumb city-scene' + (active === index ? ' is-active' : '')} />)}
      </div>
      <h3 id="city-scene-title" aria-live="polite" aria-atomic="true">{scene.title}</h3>
      <div className="city-controls" role="group" aria-label="Choose a city experience">
        {scenes.map((item, index) => <button key={item.file} type="button" aria-label={item.title} aria-pressed={active === index} aria-controls="city-scene-title" onClick={() => selectScene(index)}><span aria-hidden="true" /></button>)}
      </div>
    </div>
  </section>
}
