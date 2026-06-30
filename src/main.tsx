import React from 'react'
import ReactDOM from 'react-dom/client'
import DemoOne from './components/demo'
import { BackgroundGradientAnimationDemo } from './components/cta-demo'
import './index.css'

const heroRoot = document.getElementById('hero-root');
if (heroRoot) {
  ReactDOM.createRoot(heroRoot).render(
    <React.StrictMode>
      <DemoOne />
    </React.StrictMode>,
  );
}

const ctaRoot = document.getElementById('cta-root');
if (ctaRoot) {
  ReactDOM.createRoot(ctaRoot).render(
    <React.StrictMode>
      <BackgroundGradientAnimationDemo />
    </React.StrictMode>,
  );
}
