'use client';

import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
  style?: React.CSSProperties;
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
  direction = 'up',
  style,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const distance = 200 * speed * multiplier;
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ y, ...style }} className={cn(className)}>
      {children}
    </motion.div>
  );
}
