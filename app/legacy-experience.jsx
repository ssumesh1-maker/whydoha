'use client'

import { useEffect, useRef } from 'react'
import useLoopingGallery from './use-looping-gallery'

export default function LegacyExperience({ scenes, children, renderAction }) {
  const section = useRef(null)
  const { active, select, release } = useLoopingGallery(section, scenes.length, '.legacy-scene', '.legacy-inner', 'x')

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      section.current.querySelectorAll('img').forEach(image => { image.loading = 'eager' })
      observer.disconnect()
    }, { rootMargin: '100% 0px' })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])

  return <section ref={section} id="legacy" tabIndex={-1} className="legacy-experience" aria-labelledby="legacy-title" aria-describedby="legacy-scroll-help">
    <p id="legacy-scroll-help" className="sr-only">Scroll or swipe to loop through the gallery. Use the slide buttons to choose an image, or the section links to continue through the page.</p>
    <div className="legacy-heading">{children}</div>
    {scenes.map(([title, image, copy], index) => <div key={title} className={'legacy-scene' + (active === index ? ' is-active' : '')} aria-hidden={active !== index}>
      <div className="legacy-outer"><div className="legacy-inner">
        <div className="legacy-background"><img src={'/media/' + image} alt="" className="cover" loading="lazy" decoding="async" /></div>
        <div className="legacy-scene-copy"><h3 className="legacy-scene-title">{title}</h3><p>{copy}</p></div>
      </div></div>
    </div>)}
    <div className="legacy-toolbar">
      <div className="legacy-scene-controls" role="group" aria-label="Choose a legacy theme">
        {scenes.map(([title], index) => <button key={title} type="button" aria-label={title} aria-pressed={active === index} onClick={() => select(index)}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></button>)}
      </div>
      <span className="sr-only" role="status">{scenes[active][0]}</span>
      <div className="legacy-scene-actions">{renderAction(scenes[active])}<button className="legacy-advance" type="button" aria-label="Previous legacy slide" onClick={() => select(active - 1, -1)}>Previous slide</button><button className="legacy-advance" type="button" aria-label="Next legacy slide" onClick={() => select(active + 1, 1)}>Next slide <span aria-hidden="true">→</span></button></div>
    </div>
    <nav className="gallery-section-nav" aria-label="Leave Legacy gallery"><a href="#stories" onClick={release}>↑ Previous section</a><a href="#explore" onClick={release}>Next section ↓</a></nav>
  </section>
}
