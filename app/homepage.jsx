'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './logo.json'
import CityExperience from './city-experience'
import LegacyExperience from './legacy-experience'
import useTextReveals from './use-text-reveals'
import usePageParallax from './use-page-parallax'
import usePeopleLegacyZoom from './use-people-legacy-zoom'

const heroFilm = '/media/hero-film.mp4'
const heroPoster = '/media/hero-poster.png'

const evidence = 'Experience, infrastructure and connectivity told through real places and verified evidence.'
const nav = [['The Vision', '#vision'], ['Qatar is Ready', '#venues'], ['People & Stories', '#stories'], ['Explore Doha', '#explore']]
const legacy = [
  ['Community','7edd5.png','Athletes, volunteers, and communities across Qatar share a purpose across different backgrounds.'],
  ['Sport','8c11d.png','A shared ambition for sport across generations.'],
  ['Culture','c16da.png','An enduring legacy that brings people and cultures together.'],
]
const venues = [
  ['Lusail Stadium','1075a.png',60.4,16,'0f67b.png'],
  ['Khalifa Stadium','14cf7.png',56.7,43],
  ['Al Thumama Stadium','893e0.png',40.2,54],
  ['Stadium 974','6ef7b.png',67.838,47.01],
  ['Al Bayt Stadium','e1238.png',86,8],
]
const milestones = [['Our Ambitions','Bid vision launched'],['Engagement','Global dialogue & support'],['Candidature','Official submissions (in progress)']]
const searchable = [...nav, ['Legacy & Impact','#legacy'], ['The Journey','#journey'], ['Get Updates','#updates']]

function Pic({ file, alt = '', ...props }) {
  return <img src={'/media/' + file} alt={alt} decoding="async" {...props} />
}
const peoplePortraits = [
  [1492,121,210,'A woman sharing her story'],[1510,584,128,'Life at a Qatari souq'],
  [1480,1107,209,'Qatar supporters celebrating'],[1508,1580,128,'Qatari riders'],
  [1482,236,480,'A Qatari athlete celebrating'],[1496,1470,617,'Traditional craft in the souq'],
  [1498,121,891,'Riders against the Doha skyline'],[1500,577,935,'A Qatar athlete'],
  [1494,1252,931,'A Qatar football player'],
]
function PeopleCollage({ preview = false }) {
  return <div className={'people-collage' + (preview ? ' people-collage-preview' : '')} aria-label="People and stories from Qatar">
    <div className="people-parallax">{peoplePortraits.map(([id,x,y,alt]) => <Pic key={id} file={'people-'+id+'.png'} alt={alt} loading="lazy" style={{left:x/1832*100+'%',top:y/1118*100+'%'}} />)}</div>
  </div>
}
function Logo() {
  return <a href="#top" className="logo" aria-label="Why Doha home">
    {logo.map(([file,x,y,w,h]) => <Pic key={file} file={file} style={{left:x/2.34+'%',top:y/.7+'%',width:Math.max(w,.5)/2.34+'%',height:h/.7+'%'}} />)}
    <span>Aspiring to welcome<br />the Olympic and<br />Paralympic Games</span>
  </a>
}
function Pill({ children, href, onClick, light = false, play = false, surround }) {
  const inner = <>{children}<span className="pill-icon" aria-hidden="true"><Pic file={surround || (light?'414fa.png':'030a4.png')} /><Pic file={play?'318ce.svg':light?'5c0e4.svg':'e4328.svg'} /></span></>
  return href ? <a className="pill" href={href}>{inner}</a> : <button className="pill" type="button" onClick={onClick}>{inner}</button>
}
function Title({ label, children, id }) {
  return <div className="section-title"><p className="eyebrow"><Pic file="992af.svg" />{label}</p><h2 id={id}>{children}</h2></div>
}
function Rule({ children }) {
  return <div className="rule-text"><div aria-hidden="true"><Pic file="716f7.svg" /><span /></div><p>{children}</p></div>
}
function rotate(index, amount, count) { return (index + amount + count) % count }

export default function Homepage() {
  const [venueIndex,setVenue] = useState(null)
  const [menu,setMenu] = useState(false)
  const [modal,setModal] = useState(null)
  const [query,setQuery] = useState('')
  const [notice,setNotice] = useState('')
  const [newsletterNotice,setNewsletterNotice] = useState('')
  const [allowMotion,setAllowMotion] = useState(false)
  const heroVideo = useRef(null)
  const venueStage = useRef(null)
  const venueCard = useRef(null)
  const [cardPlacement,setCardPlacement] = useState(null)
  const root = useRef(null)
  useTextReveals(root)
  usePeopleLegacyZoom(root)
  usePageParallax(root)
  const dialog = useRef(null)
  const menuButton = useRef(null)
  const trigger = useRef(null)
  const skipRestore = useRef(false)
  const [venue,model,,,venueImage] = venues[venueIndex] || []
  const matching = searchable.filter(([label])=>label.toLowerCase().includes(query.trim().toLowerCase()))

  useLayoutEffect(()=>{
    if (venueIndex === null) return
    const stage = venueStage.current
    const card = venueCard.current
    const marker = stage.querySelectorAll('.venue-marker')[venueIndex]
    function placeCard() {
      if (window.innerWidth <= 800) return
      const area = stage.getBoundingClientRect()
      const anchor = marker.getBoundingClientRect()
      const width = card.offsetWidth
      const height = card.offsetHeight
      const gap = 20
      const padding = 24
      const right = anchor.right - area.left + gap
      const side = right + width <= area.width - padding ? 'right' : 'left'
      const x = Math.max(padding, Math.min(area.width - width - padding, side === 'right' ? right : anchor.left - area.left - width - gap))
      const anchorY = anchor.top - area.top + anchor.height / 2
      const y = Math.max(padding, Math.min(area.height - height - padding, anchorY - 36))
      setCardPlacement({ side, '--card-x': x + 'px', '--card-y': y + 'px', '--pointer-y': Math.max(20,Math.min(height - 44,anchorY - y - 12)) + 'px' })
    }
    placeCard()
    const observer = new ResizeObserver(placeCard)
    observer.observe(stage)
    observer.observe(card)
    window.addEventListener('resize',placeCard)
    return ()=>{ observer.disconnect();window.removeEventListener('resize',placeCard) }
  },[venueIndex])

  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger)
    const motion = gsap.matchMedia(root)
    motion.add({
      desktop: '(min-width: 801px)',
      animate: '(prefers-reduced-motion: no-preference)',
    },context=>{
      if (!context.conditions.animate) return
      const desktop = context.conditions.desktop
      const reveal = target => {
        gsap.from(target,{
          y:desktop ? 24 : 12,
          opacity:.65,
          duration:desktop ? .85 : .55,
          ease:'power2.out',
          clearProps:'transform,opacity',
          scrollTrigger:{trigger:target,start:'top 92%',once:true},
        })
      }
      // Animate local content only: pin containers, map markers and card geometry stay fixed.
      root.current.querySelectorAll('.vision-photo, .milestones li, .footer-links').forEach(reveal)
      if (desktop) {
      }
    },root)
    return ()=>motion.revert()
  },[])

  useEffect(()=>{
    const preference = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const syncPreference = ()=>setAllowMotion(preference.matches)
    syncPreference()
    preference.addEventListener('change',syncPreference)
    return ()=>preference.removeEventListener('change',syncPreference)
  },[])

  useEffect(()=>{
    const video = heroVideo.current
    if(allowMotion && !modal) {
      video.play().catch(()=>{})
    } else {
      video.pause()
    }
  },[allowMotion,modal])

  useEffect(()=>{
    if(modal && !dialog.current.open) dialog.current.showModal()
    if(!modal && dialog.current.open) dialog.current.close()
  },[modal])

  useEffect(()=>{
    if(!menu) return
    const escape = event=>{
      if(event.key==='Escape'){
        setMenu(false)
        menuButton.current.focus()
      }
    }
    window.addEventListener('keydown',escape)
    return ()=>window.removeEventListener('keydown',escape)
  },[menu])

  function open(event,title,image,copy,type){
    trigger.current = event.currentTarget
    skipRestore.current = false
    setQuery('')
    setNotice('')
    setModal({title,image,copy,type})
  }

  // Let native anchors update history and scroll; move focus without a second scroll.
  function navigateSection(event) {
    const link = event.target.closest('a[href^="#"]')
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const destination = document.getElementById(link.hash.slice(1))
    if (!destination) return
    setMenu(false)
    destination.focus({ preventScroll: true })
  }

  function saveEmail(event,type){
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    const updateNotice = type === 'updates' ? setNewsletterNotice : setNotice
    try {
      localStorage.setItem('why-doha-'+type,email)
      updateNotice('Saved on this device for the preview.')
    } catch {
      updateNotice('This browser could not save the email.')
    }
  }

  return <div ref={root} id="top" tabIndex={-1} className="site" onClick={navigateSection}>
    <a className="skip" href="#main">Skip to content</a>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <video autoPlay={allowMotion} ref={heroVideo} src={allowMotion ? heroFilm : undefined} poster={heroPoster} preload="none" muted loop playsInline />
      </div>
      <header className="header container">
        <Logo />
        <nav className={menu?'main-nav open':'main-nav'} id="site-navigation" aria-label="Main navigation">{nav.map(([label,href])=><a key={href} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav>
        <div className="header-actions">
          <button className="search-control" type="button" aria-label="Search homepage" onClick={e=>open(e,'Search Why Doha',null,null,'search')}><Pic file="8739d.svg" /></button>
          <span className="language" aria-label="Current language English">EN</span>
          <button className="interest" type="button" onClick={e=>open(e,'Submit interest',null,null,'interest')}>Submit interest</button>
          <button className="menu-toggle" ref={menuButton} type="button" aria-controls="site-navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?'Close':'Menu'}</button>
        </div>
      </header>
      <div className="hero-content container" id="main" tabIndex={-1}>
        <h1 id="hero-title">A city ready<br />to welcome.</h1>
        <div className="hero-meta">
          <Rule>Great ambitions begin with people. Discover the energy, hospitality and spirit that make Doha a place to connect.</Rule>
          <Pill play onClick={e=>open(e,'A city ready to welcome',null,null,'campaign-film')}>Watch the story</Pill>
        </div>
      </div>

      <a className="scroll-cue" href="#vision" aria-label="Scroll to Our Ambition">Scroll to explore<Pic file="scroll-cue-motion.svg" /></a>
    </section>

    <main aria-label="Why Doha">
      <section tabIndex={-1} id="vision" className="vision" aria-labelledby="vision-title">
        <div className="vision-layout">
          <Title label="Our Ambition" id="vision-title">More than<br />a Games</Title>
          <div className="vision-photo vision-sport"><Pic file="8c11d.png" alt="A stadium ready to welcome the world" loading="lazy" /></div>
          <div className="vision-photo vision-culture"><Pic file="c16da.png" alt="The Museum of Islamic Art" loading="lazy" /></div>
          <div className="vision-photo vision-people"><Pic file="people-1465.png" alt="Volunteers in Doha" loading="lazy" /></div>
          <div className="vision-description"><p className="vision-copy">A shared ambition begins with people.Doha's vision brings people, sport and cultures together, with the ambition to create an enduring legacy for future generations.</p>
          <Pill light onClick={e=>open(e,'Our Ambition','8c11d.png','A shared ambition begins with people.')}>Discover the vision</Pill></div>
        </div>
      </section>

      <section tabIndex={-1} id="venues" className="venues" aria-labelledby="venues-title">
        <div ref={venueStage} className="venue-stage">
          <div className="venue-map" aria-hidden="true"><Pic file="9074b.svg" /></div>
          <div className="venue-heading">
            <Title label="Qatar is Ready" id="venues-title">A city built for<br />major events</Title>
            <Pill onClick={e=>open(e,venue || 'Qatar is Ready',venueImage||model,venueImage?'Capacity shown in the bid design: 88,966. Multi-sport ready.':evidence)}>Explore the evidence</Pill>
          </div>
          <div className="venue-markers" role="group" aria-label="Select a venue">
            {venues.map(([name,file,x,y],i)=><button key={name} type="button" className="venue-marker" aria-pressed={venueIndex===i} aria-expanded={venueIndex===i} aria-controls={venueIndex===i ? "stadium-detail" : undefined} style={{'--x':x+'%','--y':y+'%'}} onClick={()=>setVenue(current=>current===i ? null : i)}><span>{name}</span><Pic className={name === 'Stadium 974' ? 'stadium-974-model' : undefined} file={file} /></button>)}
          </div>
          {venueIndex !== null && <article ref={venueCard} id="stadium-detail" className="venue-card" data-side={cardPlacement?.side} style={cardPlacement ? {'--card-x':cardPlacement['--card-x'],'--card-y':cardPlacement['--card-y'],'--pointer-y':cardPlacement['--pointer-y']} : undefined} aria-live="polite"><div key={venue} className="state-change">
            <Pic className={venueImage?'venue-photo':'venue-photo venue-model'} file={venueImage||model} alt={venue} loading="lazy" />
            <h3>{venue}</h3><p>A closer look at the places, connection and experience that shape Doha’s readiness.</p>
            {venueImage&&<div className="venue-facts"><span><Pic file="df3e7.svg" />Capacity&nbsp; 88,966</span><span><Pic file="1ded2.svg" />Multi-sport ready</span></div>}
          </div></article>}
          <div className="venue-foot"><Rule>{evidence}</Rule></div>
        </div>
      </section>

      <div className="people-transition-layer">
      <section tabIndex={-1} id="stories" className="stories" aria-labelledby="stories-title">
        <div className="people-legacy-portal" aria-hidden="true">
          <div className="telescope-back"><div className="telescope-depth"><Pic file={legacy[0][1]} alt="" loading="lazy" /></div></div>
          {[0,1,2,3,4,5].map(index => <div className="telescope-front" key={index}><div className="telescope-depth"><Pic file={legacy[0][1]} alt="" loading="lazy" /></div></div>)}
        </div>
        <div className="stories-panel">
          <PeopleCollage />
          <div className="people-heading-row"><Title label="People & Stories" id="stories-title">The people<br />behind the bid</Title></div>
          <div className="people-intro"><p>Every ambitions begins with a human story</p>
            <Pill light onClick={e=>open(e,'Meet the People',null,'Every ambitions begins with a human story','people')}>Meet the People</Pill>
          </div>
        </div>
      </section>
      </div>

      <LegacyExperience scenes={legacy} renderAction={([title,image,copy]) => <Pill onClick={e=>open(e,title,image,copy)}>Explore the legacy</Pill>}>
        <Title label="Legacy & Impact" id="legacy-title">Beyond the Games</Title>
      </LegacyExperience>

      <div className="city-overlap-layer">
      <CityExperience renderAction={scene => <Pill light onClick={e=>open(e,scene.title,scene.file,scene.title === 'Culture & Heritage' ? 'Discover Doha’s culture and heritage through its historic souq and public spaces.' : null)}>Explore Doha</Pill>}>
        <Title label="Explore Doha" id="explore-title">Experience<br />the city</Title>
      </CityExperience>
      </div>

      <section tabIndex={-1} id="journey" className="journey" aria-labelledby="journey-title">
        <div className="journey-glow" aria-hidden="true"><Pic file="0dd4d.svg" /></div>
        <div className="container journey-head"><div><Title label="The Journey" id="journey-title">Follow the<br />journey</Title><Pill href="#updates" surround="journey-arrow-surround.png">Get updates</Pill></div><Rule>{evidence}</Rule></div>
        <div className="journey-line" aria-hidden="true"><Pic file="d5f9e.svg" /><Pic file="817b8.svg" /></div>
        <ol className="milestones">{milestones.map(([title,description],i)=><li key={title}>
          <span className="milestone-connector" aria-hidden="true"><Pic file="journey-connector.svg" /></span>
          <span className="milestone-marker" aria-hidden="true"><Pic file={i<2?'a18a2.svg':'54c3d.svg'} /></span>
          <article><h3>{title}</h3><Pic file="36e04.png" loading="lazy" /><p>{description}</p></article>
        </li>)}</ol>
      </section>
    </main>

    <footer tabIndex={-1} id="updates" className="footer">
      <div className="container">
        <div className="newsletter"><h2>Stay close to<br />the story</h2><p className="newsletter-copy"><span>Get the latest updates, stories</span> <span>and key developments.</span></p>
          <form onSubmit={e=>saveEmail(e,'updates')}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email" /><button type="submit" aria-label="Register for updates"><Pic file="e4328.svg" /></button><span className="form-notice" role="status">{newsletterNotice}</span></form>
        </div>
        <div className="footer-links">{[
          ['Explore',['Our Ambition','#vision'],['Qatar is Ready','#venues'],['Experience Doha','#explore']],
          ['The Bid',['Venues & Infrastructure','#venues'],['Qatar is Ready','#venues'],['Experience Doha','#explore']],
          ['Discover',['People Stories','#stories'],['News & Updates','#journey'],['FAQs',null]],
          ['Connect',['Contact',null]],
        ].map(([title,...links])=><nav key={title} aria-label={title}><h3>{title}</h3>
          {links.map(([label,href])=>href?<a key={label} href={href}>{label}</a>:<button key={label} type="button" onClick={e=>open(e,label,null,'This page is awaiting its approved content and destination.')}>{label}</button>)}
          {title==='Connect'&&<div className="socials">{[['Instagram','85135.svg'],['YouTube','88dd3.svg'],['LinkedIn','5f200.svg']].map(([label,file])=><button type="button" aria-label={label} key={label} onClick={e=>open(e,label,null,'The official profile link is awaiting confirmation.')}><Pic file={file} /></button>)}</div>}
        </nav>)}</div>
        <div className="footer-base"><Logo />
          <div className="footer-legal">{['Privacy','Accessibility','Terms'].map(label=><button type="button" key={label} onClick={e=>open(e,label,null,'This page is awaiting its approved content and destination.')}>{label}</button>)}</div>
          <span>©WhyDoha</span>
          <a className="top-link" href="#top"><span aria-hidden="true"><Pic file="outline-motion.svg" /><Pic file="1b749.svg" /></span>Back to top</a>
        </div>
      </div>
    </footer>

    <dialog className="dialog" ref={dialog} onCancel={e=>{e.preventDefault();setModal(null)}} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();setModal(null)}}} onClose={()=>{setModal(null);if(!skipRestore.current)trigger.current?.focus({preventScroll:true})}} onClick={e=>{if(e.target===e.currentTarget)setModal(null)}} aria-labelledby="dialog-title">
      {modal&&<div className="dialog-inner">
        <button className="dialog-close" type="button" aria-label="Close dialog" onClick={()=>setModal(null)}>×</button>
        <h2 id="dialog-title">{modal.title}</h2>
        {modal.type==='campaign-film'&&<video className="dialog-image" src={heroFilm} poster={heroPoster} controls playsInline autoPlay aria-label="Campaign film" />}
        {modal.image&&<Pic className="dialog-image" file={modal.image} />}
        {modal.type==='people'&&<PeopleCollage preview />}
        {modal.copy&&<p>{modal.copy}</p>}
        {modal.type==='search'&&<div className="search-results"><label htmlFor="section-search">Find a section</label><input id="section-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} autoFocus />
          {matching.map(([label,href])=><a key={href} href={href} onClick={()=>{skipRestore.current=true;setMenu(false);setModal(null)}}>{label}</a>)}
          {matching.length===0&&<p>No matching sections.</p>}
        </div>}
        {modal.type==='interest'&&<form className="interest-form" onSubmit={e=>saveEmail(e,'interest')}><label htmlFor="interest-email">Email address</label><input id="interest-email" name="email" type="email" autoComplete="email" required /><button type="submit">Save interest</button><p role="status">{notice}</p></form>}
      </div>}
    </dialog>
  </div>
}
