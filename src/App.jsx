import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroSwitch from './sections/HeroSwitch'
import TrustedBy from './sections/TrustedBy'
import Solution from './sections/Solution'
import Stakeholders from './sections/Stakeholders'
import DashboardPreview from './sections/DashboardPreview'
import ChoosePortal from './sections/ChoosePortal'
import Footer from './sections/Footer'
import ControlCenter from './pages/ControlCenter'
import InsuranceLayout from "./pages/InsurancePlatform/InsuranceLayout";
import { ThemeProvider } from './ThemeContext'
import Dashboard from "./pages/InsurancePlatform";
import Policies from "./pages/InsurancePlatform/policies";
import Claims from "./pages/InsurancePlatform/claims";
import RiskEngine from "./pages/InsurancePlatform/riskEngine";
import Reports from "./pages/InsurancePlatform/reports";
// Wraps each major section independently — without this, an uncaught error anywhere (even in
// just one section, like the Hero's animation) takes down React's entire render tree, which is
// what was turning the whole page black instead of just the one broken part.

class SectionBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error) {
    console.warn(`A section failed to render and was skipped: ${this.props.name}`, error?.message)
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [heroComplete, setHeroComplete] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Stable reference — without useCallback, this function is recreated on every scroll-driven
  // App re-render, which was restarting the entire Hero sequence mid-playback on any scroll.
  const handleHeroComplete = useCallback(() => setHeroComplete(true), [])

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-athlonix-dark">
      <Navbar scrollY={scrollY} />
      <SectionBoundary name="Hero">
        <HeroSwitch onComplete={handleHeroComplete} />
      </SectionBoundary>
      <SectionBoundary name="TrustedBy">
        <TrustedBy />
      </SectionBoundary>
      <SectionBoundary name="ChoosePortal">
        <ChoosePortal />
      </SectionBoundary>
      <SectionBoundary name="Solution">
        <Solution />
      </SectionBoundary>
      <SectionBoundary name="Stakeholders">
        <Stakeholders />
      </SectionBoundary>
      <SectionBoundary name="DashboardPreview">
        <DashboardPreview />
      </SectionBoundary>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
  <Route path="/" element={<LandingPage />} />

  <Route path="/control-center" element={<ControlCenter />} />

  <Route path="/insurance" element={<InsuranceLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="policies" element={<Policies />} />
    <Route path="claims" element={<Claims />} />
    <Route path="risk-engine" element={<RiskEngine />} />
    <Route path="reports" element={<Reports />} />
  </Route>
</Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
