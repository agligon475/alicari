import React from 'react'
import ReactDOM from 'react-dom/client'
import DemoOne from './components/demo'
import { BackgroundGradientAnimationDemo } from './components/cta-demo'
import './index.css'

ReactDOM.createRoot(document.getElementById('hero-root') as HTMLElement).render(
  <React.StrictMode>
    <DemoOne />
  </React.StrictMode>,
)

ReactDOM.createRoot(document.getElementById('cta-root') as HTMLElement).render(
  <React.StrictMode>
    <BackgroundGradientAnimationDemo />
  </React.StrictMode>,
)
