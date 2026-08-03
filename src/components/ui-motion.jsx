import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];
export const SPRING = { type: "spring", stiffness: 200, damping: 22 };

/** Count up to `to` once `run` is true. */
export function useCountUp(to, run, decimals = 0) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / 1300);
      setN(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  return n.toFixed(decimals);
}

/**
 * Button with a material-style ripple that expands from the click point.
 * Also lifts + scales on hover.
 */
export function RippleButton({
  children,
  className = "",
  onClick,
  style,
}) {
  const [ripples, setRipples] = useState([]);
  const idRef = useRef(0);

  const handle = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = idRef.current++;
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 650);
    onClick?.();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={handle}
      style={style}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/40"
          style={{ left: r.x - 48, top: r.y - 48 }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/** Reveal-on-scroll wrapper (animates once). */
export function Reveal({
  children,
  i = 0,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}