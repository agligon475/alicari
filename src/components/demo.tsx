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
          Creatividad &<br />
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

        {/* Featured Project */}
        <div className="pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 max-w-md w-full transition-transform hover:scale-105 cursor-pointer" onClick={() => window.open('https://www.behance.net/gallery/157960549/SIMpath-proyecto-(UXUI-design)', '_blank')}>
          <img src="https://mir-s3-cdn-cf.behance.net/projects/404/29afee157960549.Y3JvcCwxMDA2LDc4NywyNzgsMA.jpg" alt="SIMpath" className="w-20 h-20 object-cover rounded-lg" />
          <div className="text-left flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary/60 block mb-1">Proyecto Destacado</span>
            <h3 className="text-lg font-semibold leading-tight">SIMpath <br/><span className="font-normal text-sm opacity-80">UX/UI design</span></h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

      </div>
    </div>
  );
}
