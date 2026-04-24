'use client';

import { useRef, useState, useEffect, type ReactNode } from 'react';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeUp({ children, delay = 0, className = '' }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  );
}
