import { GLSLHills } from "@/components/ui/glsl-hills";
import { ChevronDown } from "lucide-react";

export default function DemoOne() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-black text-white" style={{ minHeight: '100vh' }}>
      <GLSLHills />
      <div className="space-y-6 pointer-events-none z-10 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 flex flex-col items-center">
        
        <p className="text-sm uppercase tracking-widest text-primary/80 mb-2">
          Multimedia · UX/UI · Branding
        </p>
        
        <h1 className="font-semibold text-5xl md:text-7xl whitespace-pre-wrap leading-tight">
          Creatividad &amp; <br />
          <span className="italic font-thin">estrategia</span>
        </h1>
        
        <p className="text-sm md:text-base text-primary/70 max-w-2xl mx-auto mt-4">
          Diseño y desarrollo multimedia: experiencias interactivas y marcas memorables que conectan con las audiencias.
        </p>
        
        <div className="flex justify-center mt-12">
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 hover:bg-white/25 transition-all animate-bounce"
            aria-label="Ver portfolio"
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}
