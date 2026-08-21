import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Landing.css'

function Landing() {
  const introductionRef = useRef<HTMLElement | null>(null)
  const [showIntroduction, setShowIntroduction] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const section = introductionRef.current

    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowIntroduction(entry.isIntersecting)
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const scrollY = location.state?.scrollY

    if (scrollY === undefined) return

    window.scrollTo(0, scrollY)
  }, [location])

  return (
    <div className="app">

      <video
        className="background-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="/aqua-nexus-bg.mp4"
          type="video/mp4"
        />
      </video>

      <div className="overlay"></div>

      <main>

        <section className="hero">

          <div className="content">
            <h1>AQUA NEXUS</h1>
          </div>

          <div
            className={`scroll-indicator ${
              showIntroduction ? 'hidden' : ''
            }`}
          >
            SCROLL
            <span>↓</span>
          </div>

        </section>

        <section
          ref={introductionRef}
          className={`introduction ${
            showIntroduction ? 'show' : ''
          }`}
        >

          <h2>AQUA NEXUS</h2>

          <div className="title-line"></div>

          <p className="tagline">
            <br></br>Smarter feeding. Healthy growth.
            <br />
            Sustainable aquaculture.
          </p>

          <p className="description">
            A complete platform to help you choose the right feed,
            track fish growth, manage inventory, connect with trusted
            vendors and grow your aquaculture business efficiently.
          </p>

          <button
            className="get-started"
            onClick={() => navigate('/login', {
              state: {
                scrollY: window.scrollY,
              },
            })}
          >
            <span>GET STARTED→</span>
          </button>

        </section>

      </main>

    </div>
  )
}

export default Landing