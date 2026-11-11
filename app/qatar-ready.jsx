'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const stadiums = [
  { id:'al-bayt', name:'Al Bayt Stadium', image:'stadium-al-bayt.png', x:956.5, y:126 },
  { id:'lusail', name:'Lusail Stadium', image:'0f67b.png', capacity:'88,966', x:1325, y:237 },
  { id:'education-city', name:'Education City Stadium', image:'stadium-education-city.png', cardSide:'right', x:730, y:305 },
  { id:'ahmad-bin-ali', name:'Ahmad Bin Ali Stadium', image:'stadium-ahmad-bin-ali.png', x:959.5, y:383 },
  { id:'khalifa-international', name:'Khalifa International Stadium', image:'stadium-khalifa-international.png', x:1251, y:457 },
  { id:'al-thumama', name:'Al Thumama Stadium', image:'stadium-al-thumama.png', x:1171.5, y:616 },
  { id:'stadium-974', name:'Stadium 974', image:'stadium-stadium-974.png', x:1716.5, y:466 },
  { id:'al-janoub', name:'Al Janoub Stadium', image:'stadium-al-janoub.png', x:1599.5, y:694 },
]
const detail = 'A closer look at the places, connection and experience that shape Doha’s readiness.'
const evidence = 'Experience, infrastructure and connectivity told through real places and verified evidence.'
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function Media({ file, ...props }) {
  return <img src={'/media/' + file} decoding="async" {...props} />
}

export default function QatarReady({ children, renderAction }) {
  const [selected, setSelected] = useState(null)
  const [preview, setPreview] = useState(null)
  const [placement, setPlacement] = useState(null)
  const active = preview ?? selected
  const stadium = stadiums.find(item => item.id === active)
  const stage = useRef(null)
  const card = useRef(null)
  const dismissTimer = useRef(null)

  function cancelDismiss() { clearTimeout(dismissTimer.current) }
  function dismissPreview() {
    cancelDismiss()
    dismissTimer.current = setTimeout(() => setPreview(null), 220)
  }
  function show(id) {
    cancelDismiss()
    setPreview(id)
  }
  function select(id) {
    cancelDismiss()
    setPreview(null)
    setSelected(current => current === id ? null : id)
  }
  function escape(event) {
    if (event.key !== 'Escape') return
    cancelDismiss()
    setSelected(null)
    setPreview(null)
  }
  useEffect(() => () => clearTimeout(dismissTimer.current), [])

  // Geometry stays in React/CSS: no scroll transforms on the map, card or anchors.
  useLayoutEffect(() => {
    if (!stadium || !stage.current || !card.current) return
    const canvas = stage.current
    const panel = card.current
    const button = canvas.querySelector(`[data-stadium="${stadium.id}"]`)
    function position() {
      if (window.matchMedia('(max-width: 800px)').matches) {
        const anchor = button.getBoundingClientRect()
        const panelArea = panel.getBoundingClientRect()
        setPlacement({ side:'top', style:{ '--arrow-x':clamp(anchor.left + anchor.width / 2 - panelArea.left, 28, panelArea.width - 28)+'px' } })
        return
      }
      const area = canvas.getBoundingClientRect()
      const anchor = button.getBoundingClientRect()
      const w = panel.offsetWidth, h = panel.offsetHeight
      const padding = 24, gap = 22
      const centerX = anchor.left - area.left + anchor.width / 2
      const centerY = anchor.bottom - area.top + 16 * area.width / 1920
      let side, x, y, arrowX, arrowY
      if (stadium.id === 'al-janoub') {
        // The southern venue needs the card above it, with the pointer facing down.
        side = 'bottom'
        x = clamp(centerX - w / 2, padding, area.width - w - padding)
        y = clamp(anchor.top - area.top - h - gap, padding, area.height - h - padding)
        arrowX = clamp(centerX - x, 28, w - 28)
      } else if (stadium.cardSide !== 'right' && anchor.left - area.left >= w + gap + padding) {
        side = 'right'
        x = anchor.left - area.left - w - gap
        y = clamp(centerY - h + 65, padding, area.height - h - padding)
        arrowY = clamp(centerY - y, 28, h - 28)
      } else {
        side = 'left'
        x = clamp(anchor.right - area.left + gap, padding, area.width - w - padding)
        y = clamp(centerY - h / 2, padding, area.height - h - padding)
        arrowY = clamp(centerY - y, 28, h - 28)
      }
      setPlacement({ side, style:{ '--detail-x':x+'px', '--detail-y':y+'px', '--arrow-x':(arrowX || 0)+'px', '--arrow-y':(arrowY || 0)+'px' } })
    }
    position()
    const observer = new ResizeObserver(position)
    observer.observe(canvas)
    observer.observe(panel)
    window.addEventListener('resize', position)
    return () => { observer.disconnect(); window.removeEventListener('resize', position) }
  }, [stadium])

  return <section tabIndex={-1} id="venues" className="venues qatar-ready" aria-labelledby="venues-title" onKeyDown={escape}>
    <div ref={stage} className="venue-stage qatar-stage">
      <div className="qatar-art" aria-hidden="true">
        <Media file="qatar-ready-map.png" className="qatar-coast" alt="" />
        <Media file="qatar-shade-lower.svg" className="qatar-shade qatar-shade-lower" alt="" />
        <Media file="qatar-shade-left.svg" className="qatar-shade qatar-shade-left" alt="" />
        <Media file="qatar-shade-top.svg" className="qatar-shade qatar-shade-top" alt="" />
        <Media file="qatar-shade-bottom.svg" className="qatar-shade qatar-shade-bottom" alt="" />
      </div>
      <div className="qatar-heading">{children}{renderAction(stadium)}</div>
      <div className="qatar-hotspots" role="group" aria-label="Explore stadiums">
        {stadiums.map(item => <button key={item.id} type="button" className="qatar-hotspot" data-stadium={item.id} data-active={active === item.id} style={{ '--stadium-x':item.x/1920*100+'%', '--stadium-y':item.y/1070*100+'%' }} aria-pressed={selected === item.id} aria-expanded={active === item.id} aria-controls={active === item.id ? 'stadium-detail' : undefined}
          onPointerEnter={event => { if(event.pointerType === 'mouse') show(item.id) }} onPointerLeave={dismissPreview}
          onFocus={event => { if(event.currentTarget.matches(':focus-visible')) show(item.id) }} onBlur={dismissPreview}
          onClick={() => select(item.id)}>
          <span className="qatar-label">{item.name}</span>
          <Media file="qatar-pin.svg" className="qatar-pin" alt="" />
        </button>)}
      </div>
      {stadium && <article ref={card} id="stadium-detail" className="qatar-card" data-side={placement?.side} style={placement?.style} onPointerEnter={cancelDismiss} onPointerLeave={dismissPreview} aria-live="polite" aria-atomic="true">
        <span className="qatar-card-arrow" aria-hidden="true"><Media file="qatar-card-pointer.svg" alt="" /></span>
        {stadium.image ? <Media className="qatar-photo" file={stadium.image} alt={stadium.name} style={stadium.id === 'al-thumama' ? {objectPosition:'center 67%'} : undefined} /> : <div className="qatar-photo qatar-photo-illustration" role="img" aria-label="Al Janoub Stadium illustration from the Qatar map" />}
        <h3>{stadium.name}</h3>
        <p>{detail}</p>
        <div className="qatar-facts">
          {stadium.capacity && <span><Media file="df3e7.svg" alt="" />Capacity&nbsp; {stadium.capacity}</span>}
          <span><Media file="1ded2.svg" alt="" />Multi-sport ready</span>
        </div>
      </article>}
      <div className="qatar-evidence"><Media file="qatar-evidence-rule.svg" alt="" /><p>{evidence}</p></div>
    </div>
  </section>
}
