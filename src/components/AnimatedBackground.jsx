import React, { memo } from 'react';
import { usePerformance } from '@/components/PerformanceOptimizer';

const AnimatedBackground = () => {
  const { isLowPowerMode } = usePerformance();

  // If user prefers reduced motion, render a static gradient
  if (isLowPowerMode) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#115e59] z-0" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f172a]">
      {/* Base Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] opacity-90" />

      {/* Animated Orbs */}
      <div className="mesh-gradient-container absolute inset-0 opacity-60">
        {/* Orb 1: Deep Purple */}
        <div 
          className="absolute w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob"
          style={{
            top: '-10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.8) 0%, rgba(76, 29, 149, 0) 70%)',
            animationDelay: '0s',
            willChange: 'transform'
          }}
        />

        {/* Orb 2: Teal/Cyan */}
        <div 
          className="absolute w-[50vw] h-[50vw] rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob"
          style={{
            top: '20%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(45, 212, 191, 0.6) 0%, rgba(13, 148, 136, 0) 70%)',
            animationDelay: '2s',
            willChange: 'transform'
          }}
        />

        {/* Orb 3: Deep Blue */}
        <div 
          className="absolute w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"
          style={{
            bottom: '-20%',
            left: '20%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.7) 0%, rgba(30, 58, 138, 0) 70%)',
            animationDelay: '4s',
            willChange: 'transform'
          }}
        />
        
        {/* Orb 4: Indigo Accent */}
        <div 
          className="absolute w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[60px] opacity-30 animate-blob"
          style={{
            bottom: '10%',
            right: '30%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(67, 56, 202, 0) 70%)',
            animationDelay: '6s',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Noise Texture Overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />
      
      <style>{`
        @keyframes blob {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(30px, -50px, 0) scale(1.1); }
          66% { transform: translate3d(-20px, 20px, 0) scale(0.9); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default memo(AnimatedBackground);