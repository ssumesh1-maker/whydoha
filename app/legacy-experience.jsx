'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

export default function LegacyExperience({ scenes, children, renderAction }) {
  const section = useRef(null)
  const sequence = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      section.current.querySelectorAll('img').forEach(image => { image.loading = 'eager' })
      observer.disconnect()
    }, { rootMargin: '100% 0px' })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)
    const media = gsap.matchMedia()
    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      media.add('(prefers-reduced-motion: no-preference) and (min-height: 620px)', () => {
        const panels = section.current.querySelectorAll('.legacy-scene')
        const outers = section.current.querySelectorAll('.legacy-outer')
        const inners = section.current.querySelectorAll('.legacy-inner')
        const backgrounds = section.current.querySelectorAll('.legacy-background')
        const headings = Array.from(section.current.querySelectorAll('.legacy-scene-title')).map(heading => SplitText.create(heading, { type: 'chars,words', aria: 'auto' }))
        gsap.set(panels, { autoAlpha: 0 })
        gsap.set(panels[0], { autoAlpha: 1 })
        gsap.set(Array.from(outers).slice(1), { xPercent: 100 })
        gsap.set(Array.from(inners).slice(1), { xPercent: -100 })
        const timeline = gsap.timeline({ defaults: { duration: 1, ease: 'power1.inOut' } })
        timeline.addLabel('scene-0', 0)
        scenes.slice(1).forEach((_, offset) => {
          const i = offset + 1
          const start = .5 + offset * 1.5
          timeline.set(panels[i], { autoAlpha: 1, zIndex: i }, start)
            .fromTo(outers[i], { xPercent: 100 }, { xPercent: 0 }, start)
            .fromTo(inners[i], { xPercent: -100 }, { xPercent: 0 }, start)
            .fromTo(backgrounds[i], { xPercent: 15 }, { xPercent: 0 }, start)
            .to(backgrounds[i - 1], { xPercent: -15 }, start)
            .fromTo(headings[i].chars, { autoAlpha: 0, xPercent: 150 }, { autoAlpha: 1, xPercent: 0, duration: .7, stagger: { amount: .2, from: 'center' }, ease: 'power2.out' }, start + .15)
            .set(panels[i - 1], { autoAlpha: 0 }, start + 1)
            .addLabel('scene-' + i, start + 1)
        })
        timeline.to({}, { duration: .5 })
        // Hold the final scene for the extra viewport in which the city covers it.
        timeline.to({}, { duration: timeline.duration() / (scenes.length - 1) })
        const container = section.current.parentElement
        const toolbar = section.current.querySelector('.legacy-toolbar')
        container.classList.add('legacy-city-overlap')
        const measureOverlap = () => container.style.setProperty('--legacy-overlap-height', section.current.offsetHeight + 'px')
        measureOverlap()
        const trigger = ScrollTrigger.create({
          id: 'legacy-experience', trigger: section.current, animation: timeline,
          start: 'top top', end: () => { measureOverlap(); return '+=' + innerHeight * scenes.length },
          pin: true, scrub: .35, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => {
            const time = self.progress * timeline.duration()
            let index = 0
            scenes.forEach((_, i) => { if (time >= timeline.labels['scene-' + i] - .01) index = i })
            setActive(index)
            toolbar.inert = self.progress >= (scenes.length - 1) / scenes.length
          },
        })
        sequence.current = { trigger, timeline }
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        return () => {
          sequence.current = null
          container.classList.remove('legacy-city-overlap')
          container.style.removeProperty('--legacy-overlap-height')
          toolbar.inert = false
          headings.forEach(heading => heading.revert())
        }
      }, section)
    })
    return () => { disposed = true; media.revert() }
  }, [scenes])

  function select(index) {
    const current = sequence.current
    if (current) {
      const progress = current.timeline.labels['scene-' + index] / current.timeline.duration()
      window.scrollTo({ top: current.trigger.start + progress * (current.trigger.end - current.trigger.start), behavior: 'instant' })
    }
    setActive(index)
  }

  return <section ref={section} id="legacy" tabIndex={-1} className="legacy-experience" aria-labelledby="legacy-title">
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
      <div className="legacy-scene-actions">{renderAction(scenes[active])}<button className="legacy-advance" type="button" onClick={() => active < scenes.length - 1 ? select(active + 1) : select(0)}>Next <span aria-hidden="true">↓</span></button></div>
    </div>
  </section>
}
