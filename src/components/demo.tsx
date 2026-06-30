import { GLSLHills } from "@/components/ui/glsl-hills";
import { MonitorPlay, PenTool, LayoutTemplate, ArrowRight } from "lucide-react";

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
        
        <div className="flex justify-center gap-6 mt-8 opacity-70 mb-12">
          <MonitorPlay className="w-6 h-6" />
          <LayoutTemplate className="w-6 h-6" />
          <PenTool className="w-6 h-6" />
        </div>

      </div>
    </div>
  );
}
