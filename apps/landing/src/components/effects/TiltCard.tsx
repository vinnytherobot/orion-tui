'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
  scale?: number;
}

export function TiltCard({ children, className = '', max = 6, scale = 1.015 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reducedMotion) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;

    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  };

  const tiltX = reducedMotion ? 0 : -coords.y * max;
  const tiltY = reducedMotion ? 0 : coords.x * max;

  const style: React.CSSProperties =
    isHovered && !reducedMotion
      ? {
          transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
          transition: 'transform 0.1s ease-out, box-shadow 0.2s ease-out',
          willChange: 'transform',
        }
      : {
          transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
          transition:
            'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        };

  const glareX = (coords.x + 0.5) * 100;
  const glareY = (coords.y + 0.5) * 100;

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovered && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-30 opacity-25 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 200px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2), transparent 80%)`,
          }}
        />
      )}
    </div>
  );
}
