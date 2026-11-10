'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './logo.json'
import CityExperience from './city-experience'

const heroFilm = '/media/hero-film.mp4'
const heroPoster = '/media/hero-poster.png'

const evidence = 'Experience, infrastructure and connectivity told through real places and verified evidence.'
const nav = [['The Vision', '#vision'], ['Qatar is Ready', '#venues'], ['People & Stories', '#stories'], ['Explore Doha', '#explore']]
const vision = [['Sport','8c11d.png'],['People','cf4ea.png'],['Culture','c16da.png'],['Doha','9aded.png']]
const stories = [['Athletes','7aa1c.png'],['Community','cf4ea.png'],['Culture','36e04.png']]
const legacy = [
  ['Community','7edd5.png','Athletes, volunteers, and communities across Qatar share a purpose across different backgrounds.'],
  ['Sport','8c11d.png','A shared ambition for sport across generations.'],
  ['Culture','c16da.png','An enduring legacy that brings people and cultures together.'],
]
const venues = [
  ['Lusail Stadium','1075a.png',60.4,16,'0f67b.png'],
  ['Khalifa Stadium','14cf7.png',56.7,43],
  ['Al Thumama Stadium','893e0.png',40.2,54],
  ['Stadium 974','6ef7b.png',71.4,71],
  ['Al Bayt Stadium','e1238.png',86,8],
]
const milestones = [['Our Ambitions','Bid vision launched'],['Engagement','Global dialogue & support'],['Candidature','Official submissions (in progress)']]
const searchable = [...nav, ['Legacy & Impact','#legacy'], ['The Journey','#journey'], ['Get Updates','#updates']]

function Pic({ file, alt = '', ...props }) {
  return <img src={'/media/' + file} alt={alt} decoding="async" {...props} />
}
function Logo() {
  return <a href="#top" className="logo" aria-label="Why Doha home">
    {logo.map(([file,x,y,w,h]) => <Pic key={file} file={file} style={{left:x/2.34+'%',top:y/.7+'%',width:Math.max(w,.5)/2.34+'%',height:h/.7+'%'}} />)}
    <span>Aspiring to welcome<br />the Olympic and<br />Paralympic Games</span>
  </a>
}
function Pill({ children, href, onClick, light = false, play = false }) {
  const inner = <>{children}<span className="pill-icon" aria-hidden="true"><Pic file={light?'414fa.png':'030a4.png'} /><Pic file={play?'318ce.svg':light?'5c0e4.svg':'e4328.svg'} /></span></>
  return href ? <a className="pill" href={href}>{inner}</a> : <button className="pill" type="button" onClick={onClick}>{inner}</button>
}
function Title({ label, children, id }) {
  return <div className="section-title"><p className="eyebrow"><Pic file="992af.svg" />{label}</p><h2 id={id}>{children}</h2></div>
}
function Rule({ children }) {
  return <div className="rule-text"><div aria-hidden="true"><Pic file="716f7.svg" /><span /></div><p>{children}</p></div>
}
function Dots({ items, active, select, name }) {
  return <div className="dots" role="group" aria-label={name}>{items.map(([title],i) => <button key={title} type="button" aria-label={title} aria-pressed={active===i} onClick={()=>select(i)} />)}</div>
}
function rotate(index, amount, count) { return (index + amount + count) % count }

export default function Homepage() {
  const [visionIndex,setVision] = useState(1)
  const [venueIndex,setVenue] = useState(0)
  const [storyIndex,setStory] = useState(0)
  const [legacyIndex,setLegacy] = useState(0)
  const [menu,setMenu] = useState(false)
  const [modal,setModal] = useState(null)
  const [query,setQuery] = useState('')
  const [notice,setNotice] = useState('')
  const [newsletterNotice,setNewsletterNotice] = useState('')
  const [allowMotion,setAllowMotion] = useState(false)
  const [heroPaused,setHeroPaused] = useState(false)
  const heroVideo = useRef(null)
  const root = useRef(null)
  const dialog = useRef(null)
  const menuButton = useRef(null)
  const trigger = useRef(null)
  const skipRestore = useRef(false)
  const [venue,model,,,venueImage] = venues[venueIndex]
  const [story,storyImage] = stories[storyIndex]
  const [theme,themeImage,themeCopy] = legacy[legacyIndex]
  const matching = searchable.filter(([label])=>label.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(()=>{
    gsap.registerPlugin(ScrollTrigger)
    const motion = gsap.matchMedia(root)
    motion.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)',()=>{
      gsap.to('.hero-media video',{yPercent:7,scale:1.04,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.4}})
      gsap.fromTo('.journey-line',{clipPath:'inset(0 88% 0 0)'},{clipPath:'inset(0 0% 0 0)',ease:'none',scrollTrigger:{trigger:'.journey',start:'top 78%',end:'bottom 75%',scrub:.35}})
      gsap.from('.vision-gallery',{y:26,duration:.7,ease:'power2.out',scrollTrigger:{trigger:'.vision-gallery',start:'top 90%',once:true}})
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
    if(allowMotion && !heroPaused && !modal) {
      video.play().catch(()=>{})
    } else {
      video.pause()
    }
  },[allowMotion,heroPaused,modal])

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
        <video ref={heroVideo} src={allowMotion ? heroFilm : undefined} poster={heroPoster} preload="none" muted loop playsInline />
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
      {allowMotion && <button className="hero-playback" type="button" onClick={()=>setHeroPaused(!heroPaused)}>{heroPaused ? 'Play background' : 'Pause background'}</button>}
      <a className="scroll-cue" href="#vision" aria-label="Scroll to Our Ambition">Scroll to explore<Pic file="scroll-cue-motion.svg" /></a>
    </section>

    <main aria-label="Why Doha">
      <section tabIndex={-1} id="vision" className="vision" aria-labelledby="vision-title">
        <Title label="Our Ambition" id="vision-title">More than a Games</Title>
        <p className="vision-copy">A shared ambition begins with people. Doha’s vision brings people, sport and cultures together, with the ambition to create an enduring legacy for future generations.</p>
        <div className="vision-gallery" role="group" aria-label="Explore the vision imagery">
          {vision.map(([label,file],i)=>{
            const position = rotate(i,-visionIndex+1,vision.length)
            return <button key={label} className={'vision-image offset-'+position} aria-label={'Show '+label} aria-pressed={i===visionIndex} aria-controls="vision-detail" type="button" onClick={()=>setVision(i)}><Pic file={file} loading="lazy" /></button>
          })}
        </div>
        <span className="sr-only" role="status">{vision[visionIndex][0]} selected</span>
        <div id="vision-detail"><Pill light onClick={e=>open(e,vision[visionIndex][0],vision[visionIndex][1],'A shared ambition begins with people.')}>Discover the vision</Pill></div>
      </section>

      <section tabIndex={-1} id="venues" className="venues" aria-labelledby="venues-title">
        <div className="venue-stage">
          <div className="venue-map" aria-hidden="true"><Pic file="9074b.svg" /></div>
          <div className="venue-heading">
            <Title label="Qatar is Ready" id="venues-title">A city built for<br />major events</Title>
            <Pill onClick={e=>open(e,venue,venueImage||model,venueImage?'Capacity shown in the bid design: 88,966. Multi-sport ready.':evidence)}>Explore the evidence</Pill>
          </div>
          <div className="venue-markers" role="group" aria-label="Select a venue">
            {venues.map(([name,file,x,y],i)=><button key={name} type="button" className="venue-marker" aria-pressed={venueIndex===i} style={{'--x':x+'%','--y':y+'%'}} onClick={()=>setVenue(i)}><span>{name}</span><Pic file={file} /></button>)}
          </div>
          <article className="venue-card" aria-live="polite"><div key={venue} className="state-change">
            <Pic className={venueImage?'venue-photo':'venue-photo venue-model'} file={venueImage||model} alt={venue} loading="lazy" />
            <h3>{venue}</h3><p>A closer look at the places, connection and experience that shape Doha’s readiness.</p>
            {venueImage&&<div className="venue-facts"><span><Pic file="df3e7.svg" />Capacity&nbsp; 88,966</span><span><Pic file="1ded2.svg" />Multi-sport ready</span></div>}
          </div></article>
          <div className="venue-foot"><Rule>{evidence}</Rule></div>
        </div>
      </section>

      <section tabIndex={-1} id="stories" className="stories" aria-labelledby="stories-title">
        <div className="stories-panel">
          <Title label="People & Stories" id="stories-title">The people behind<br />the bid</Title>
          <div className="stories-stage">
            <span className="stories-word" aria-hidden="true">{story}</span>
            <article className="story-card state-change" key={story}>
              <Pic className="cover" file={storyImage} loading="lazy" />
              <div className="story-meta"><h3>{story}</h3><Pill play onClick={e=>open(e,story,storyImage,'Video playback is awaiting source media.')}>Play story</Pill></div>
            </article>
          </div>
          <Dots items={stories} active={storyIndex} select={setStory} name="Choose a story" />
        </div>
      </section>

      <section tabIndex={-1} id="legacy" className="legacy" aria-labelledby="legacy-title">
        <div className="legacy-info">
          <Title label="Legacy & Impact" id="legacy-title">Beyond the<br />Games</Title>
          <div><Rule>{evidence}</Rule><div className="legacy-actions">
            <Dots items={legacy} active={legacyIndex} select={setLegacy} name="Choose a legacy theme" />
            <Pill onClick={e=>open(e,theme,themeImage,themeCopy)}>Explore the legacy</Pill>
          </div></div>
        </div>
        <div className="legacy-image">
          <div className="legacy-slide state-change" key={theme}><Pic className="cover" file={themeImage} loading="lazy" /><div className="legacy-caption" aria-live="polite"><h3>{theme}</h3><p>{themeCopy}</p></div></div>
          <button className="next" type="button" aria-label="Next legacy theme" onClick={()=>setLegacy(i=>rotate(i,1,legacy.length))}>Next</button>
        </div>
      </section>

      <CityExperience renderAction={scene => <Pill light onClick={e=>open(e,scene.title,scene.file,scene.title === 'Culture & Heritage' ? 'Discover Doha’s culture and heritage through its historic souq and public spaces.' : null)}>Explore Doha</Pill>}>
        <Title label="Explore Doha" id="explore-title">Experience<br />the city</Title>
      </CityExperience>

      <section tabIndex={-1} id="journey" className="journey" aria-labelledby="journey-title">
        <div className="journey-glow" aria-hidden="true"><Pic file="0dd4d.svg" /></div>
        <div className="container journey-head"><div><Title label="The Journey" id="journey-title">Follow the<br />journey</Title><Pill href="#updates">Get updates</Pill></div><Rule>{evidence}</Rule></div>
        <div className="journey-line" aria-hidden="true"><Pic file="d5f9e.svg" /><Pic file="817b8.svg" /></div>
        <ol className="milestones">{milestones.map(([title,description],i)=><li key={title}>
          <span className="milestone-marker" aria-hidden="true"><Pic file={i<2?'a18a2.svg':'54c3d.svg'} /></span>
          <article><h3>{title}</h3><Pic file="36e04.png" loading="lazy" /><p>{description}</p></article>
        </li>)}</ol>
      </section>
    </main>

    <footer tabIndex={-1} id="updates" className="footer">
      <div className="container">
        <div className="newsletter"><h2>Stay close to<br />the story</h2><p>Get the latest updates, stories and key developments.</p>
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
