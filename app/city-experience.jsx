'use client'

import { useEffect, useRef } from 'react'
import useLoopingGallery from './use-looping-gallery'

const scenes = [
  { title: 'Culture & Heritage', file: '36e04.png', alt: 'A Qatari souq at golden hour' },
  { title: 'City life', file: 'city-life.png', alt: 'People walking and cycling beside Doha’s waterfront skyline' },
  { title: 'Nature & outdoors', file: 'nature-outdoors.png', alt: 'A family walking beside mangroves overlooking Doha’s skyline' },
  { title: 'Food & lifestyle', file: 'food-lifestyle.png', alt: 'A family sharing a meal at an outdoor restaurant in Doha' },
]

export default function CityExperience({ children, renderAction }) {
  const section = useRef(null)
  const { active, select: selectScene, release } = useLoopingGallery(section, scenes.length, '.city-backgrounds .city-scene,.city-thumbnails .city-scene', '.city-inner', 'y')

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

  const scene = scenes[active]
  return <section ref={section} tabIndex={-1} id="explore" className="explore city-experience" aria-labelledby="explore-title" aria-describedby="city-scroll-help">
    <p id="city-scroll-help" className="sr-only">Scroll or swipe to loop through the gallery. Use the slide buttons to choose an image, or the section links to continue through the page.</p>
    <div className="city-backgrounds" aria-hidden="true">
      {scenes.map((item, index) => <div key={item.file} className={'city-scene' + (active === index ? ' is-active' : '')}><div className="city-inner"><div className="city-depth"><img src={'/media/' + item.file} alt="" decoding="async" loading="lazy" className="cover" /></div></div></div>)}
    </div>
    <div className="explore-card">
      {children}
      {renderAction(scene)}
      <div className="city-thumbnails">
        {scenes.map((item, index) => <div key={item.file} aria-hidden={active !== index} className={'city-scene' + (active === index ? ' is-active' : '')}><div className="city-inner"><div className="city-depth"><img src={'/media/' + item.file} alt={item.alt} decoding="async" loading="lazy" className="explore-thumb" /></div></div></div>)}
      </div>
      <h3 id="city-scene-title" aria-live="polite" aria-atomic="true">{scene.title}</h3>
      <div className="city-controls" role="group" aria-label="Choose a city experience">
        <button type="button" aria-label="Previous city slide" onClick={() => selectScene(active - 1, -1)}>←</button>
        {scenes.map((item, index) => <button key={item.file} type="button" aria-label={item.title} aria-pressed={active === index} aria-controls="city-scene-title" onClick={() => selectScene(index)}><span aria-hidden="true" /></button>)}
        <button type="button" aria-label="Next city slide" onClick={() => selectScene(active + 1, 1)}>→</button>
      </div>
    </div>
    <nav className="gallery-section-nav" aria-label="Leave City gallery"><a href="#legacy" onClick={release}>↑ Previous section</a><a href="#journey" onClick={release}>Next section ↓</a></nav>
  </section>
}
