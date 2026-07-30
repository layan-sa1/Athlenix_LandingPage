import React, { useState, useEffect } from 'react'
import Hero from './Hero'
import HeroCSS from './HeroCSS'

// WebGL is used by default (the visual quality that's actually wanted) — but wrapped in real
// crash protection: an error boundary around the whole render, plus a listener for the GPU
// dropping the context mid-session. Either one silently swaps to the CSS hero instead of a dead
// black screen. No pre-flight "is this reliable" guess anymore — that check was passing on this
// machine and then still failing later, so it wasn't actually protecting anything.
class HeroErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.warn('WebGL Hero failed to render — falling back to the CSS hero.', error?.message)
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export default function HeroSwitch({ onComplete }) {
  const [contextLost, setContextLost] = useState(false)

  useEffect(() => {
    const onLost = (e) => {
      e.preventDefault?.()
      console.warn('WebGL context lost — falling back to the CSS hero.')
      setContextLost(true)
    }
    window.addEventListener('webglcontextlost', onLost, true)
    return () => window.removeEventListener('webglcontextlost', onLost, true)
  }, [])

  if (contextLost) {
    return <HeroCSS onComplete={onComplete} />
  }

  return (
    <HeroErrorBoundary fallback={<HeroCSS onComplete={onComplete} />}>
      <Hero onComplete={onComplete} />
    </HeroErrorBoundary>
  )
}
