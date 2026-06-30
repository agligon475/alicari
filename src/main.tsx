import React from 'react'
import ReactDOM from 'react-dom/client'
import DemoOne from './components/demo'
import './index.css'

ReactDOM.createRoot(document.getElementById('hero-root') as HTMLElement).render(
  <React.StrictMode>
    <DemoOne />
  </React.StrictMode>,
)
