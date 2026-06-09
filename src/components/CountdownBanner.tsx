import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";

const pad = (n: number) => n.toString().padStart(2, "0");
const DURATION_MS = 20 * 60 * 1000; // 20 minutos

export const CountdownBanner = () => {
  const [now, setNow] = useState(() => Date.now());
  const deadlineRef = useRef<number>(Date.now() + DURATION_MS);
  const [deadline, setDeadline] = useState<number>(deadlineRef.current);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (now >= deadline) {
      const next = now + DURATION_MS;
      deadlineRef.current = next;
      setDeadline(next);
    }
  }, [now, deadline]);

  const diff = Math.max(0, deadline - now);
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return (
    <div className="bg-terracotta text-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" fill="currentColor" />
          <span className="text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] font-medium">
            Promoção de Lançamento · 20% OFF + 5% extra no PIX
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[0.7rem] md:text-[0.75rem] font-medium tabular-nums">
          <span className="opacity-80 text-[0.6rem] uppercase tracking-[0.2em] mr-1">
            expira em
          </span>
          <TimeBox label="m" value={pad(minutes)} />
          <span className="opacity-70">:</span>
          <TimeBox label="s" value={pad(seconds)} />
        </div>
      </div>
    </div>
  );
};

const TimeBox = ({ value, label }: { value: string; label: string }) => (
  <span className="inline-flex items-baseline gap-0.5">
    <span className="bg-cream/15 px-1.5 py-0.5 rounded-sm">{value}</span>
    <span className="text-[0.55rem] opacity-70">{label}</span>
  </span>
);
