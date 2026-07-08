const MESSAGES = [
  "Frete grátis para todo o Brasil",
  "Curadoria com olhar de arquiteta",
  "Despacho em até 2 dias úteis",
  "Caixas decorativas · 20% OFF + 5% extra no PIX",
  "7 dias para troca",
];

export const MarqueeBar = () => {
  const all = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-ink text-cream overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2.5">
        {all.map((m, i) => (
          <span key={i} className="mx-8 text-[0.65rem] uppercase tracking-[0.3em]">
            {m} <span className="ml-8 opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
};
