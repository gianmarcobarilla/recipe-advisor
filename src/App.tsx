import { Component, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WizardPage } from './pages/WizardPage'
import { ResultPage } from './pages/ResultPage'
import { HistoryPage } from './pages/HistoryPage'
import { NavBar } from './components/NavBar'
import { Button } from './components/Button'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            gap: '1rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--color-text-muted)' }}>
            Something went wrong. Please try again.
          </p>
          <Button variant="primary" onClick={() => window.location.assign('/')}>
            Try again
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

export const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<WizardPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            {/* fallback for non-existing routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
