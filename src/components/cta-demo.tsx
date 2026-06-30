import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(160, 10, 10)"
      gradientBackgroundEnd="rgb(90, 0, 0)"
      firstColor="252, 34, 34"      // Rojo Alicari
      secondColor="220, 20, 60"     // Crimson
      thirdColor="255, 99, 71"      // Tomato
      fourthColor="139, 0, 0"       // Dark Red
      fifthColor="200, 30, 30"
      pointerColor="252, 34, 34"
      containerClassName="!h-[500px] !w-full"
      className="absolute inset-0 z-50 flex items-center justify-center text-white px-4 text-center"
    >
      <div className="max-w-2xl mx-auto space-y-6 pointer-events-auto">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
          ¿Tenés un proyecto en mente?
        </h2>
        <p className="text-white/90 text-base md:text-lg max-w-xl mx-auto">
          Trabajemos juntos para crear marcas memorables y productos digitales que marquen la diferencia.
        </p>
        <div className="pt-4">
          <a href="contact.html" className="inline-flex items-center justify-center px-8 py-4 bg-black hover:bg-neutral-950 text-white font-medium rounded-full transition-all hover:scale-105 shadow-lg shadow-black/20 decoration-none no-underline">
            Hablemos
          </a>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}
