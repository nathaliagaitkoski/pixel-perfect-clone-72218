interface Props {
  variant?: "light" | "dark";
}

// Mini-logos SVG das bandeiras (estilo flat, fundo branco)
const CardBadge = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div
    aria-label={label}
    title={label}
    className="bg-white border border-black/10 rounded-[3px] w-11 h-7 flex items-center justify-center shadow-sm"
  >
    {children}
  </div>
);

const PixLogo = () => (
  <CardBadge label="Pix">
    <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#32BCAD"
        d="M11.7 32.6a5.7 5.7 0 0 1-4-1.66l-5.2-5.2a2.5 2.5 0 0 1 0-3.54l5.2-5.2a5.7 5.7 0 0 1 4-1.66h1.1l6.6 6.6a3.7 3.7 0 0 0 5.2 0l6.58-6.58h1.34c1.5 0 2.94.6 4 1.66l5.2 5.2a2.5 2.5 0 0 1 0 3.54l-5.2 5.2a5.7 5.7 0 0 1-4 1.66h-1.34l-6.58-6.58a3.8 3.8 0 0 0-5.2 0l-6.6 6.6h-1.1Zm12.3-1.86a1.83 1.83 0 0 1-1.3-.55l-6.18-6.18 6.18-6.18a1.85 1.85 0 0 1 2.6 0l6.18 6.18-6.18 6.18a1.83 1.83 0 0 1-1.3.55Z"
      />
    </svg>
  </CardBadge>
);

const VisaLogo = () => (
  <CardBadge label="Visa">
    <svg viewBox="0 0 48 16" className="w-9 h-4" aria-hidden="true">
      <text x="24" y="13" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="14" fill="#1A1F71">VISA</text>
    </svg>
  </CardBadge>
);

const MasterLogo = () => (
  <CardBadge label="Mastercard">
    <svg viewBox="0 0 32 20" className="w-7 h-4" aria-hidden="true">
      <circle cx="12" cy="10" r="7" fill="#EB001B" />
      <circle cx="20" cy="10" r="7" fill="#F79E1B" />
      <path d="M16 4.6a7 7 0 0 1 0 10.8 7 7 0 0 1 0-10.8Z" fill="#FF5F00" />
    </svg>
  </CardBadge>
);

const EloLogo = () => (
  <CardBadge label="Elo">
    <svg viewBox="0 0 40 16" className="w-9 h-4" aria-hidden="true">
      <text x="20" y="12" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="11" fill="#000">elo</text>
      <circle cx="6" cy="8" r="2" fill="#FFCB05" />
      <circle cx="34" cy="8" r="2" fill="#EF4123" />
    </svg>
  </CardBadge>
);

const AmexLogo = () => (
  <CardBadge label="American Express">
    <svg viewBox="0 0 40 16" className="w-9 h-4" aria-hidden="true">
      <rect width="40" height="16" fill="#1F72CD" rx="1" />
      <text x="20" y="11" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="6.5" fill="#fff">AMEX</text>
    </svg>
  </CardBadge>
);

const HiperLogo = () => (
  <CardBadge label="Hipercard">
    <svg viewBox="0 0 40 16" className="w-9 h-4" aria-hidden="true">
      <rect width="40" height="16" fill="#B3131B" rx="1" />
      <text x="20" y="11" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontStyle="italic" fontSize="6" fill="#fff">HIPER</text>
    </svg>
  </CardBadge>
);

const DinersLogo = () => (
  <CardBadge label="Diners Club">
    <svg viewBox="0 0 40 16" className="w-9 h-4" aria-hidden="true">
      <circle cx="20" cy="8" r="6" fill="#0079BE" />
      <text x="20" y="10.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="4" fill="#fff">DINERS</text>
    </svg>
  </CardBadge>
);

const DiscoverLogo = () => (
  <CardBadge label="Discover">
    <svg viewBox="0 0 40 16" className="w-9 h-4" aria-hidden="true">
      <rect width="40" height="16" fill="#fff" />
      <text x="14" y="11" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="6" fill="#000">DISCOVER</text>
      <circle cx="32" cy="8" r="4" fill="#F58220" />
    </svg>
  </CardBadge>
);

const BoletoLogo = () => (
  <CardBadge label="Boleto bancário">
    <svg viewBox="0 0 40 16" className="w-9 h-4" aria-hidden="true">
      {[2, 5, 7, 10, 13, 15, 18, 21, 23, 26, 29, 31, 34, 37].map((x, i) => (
        <rect key={i} x={x} y="2" width={i % 3 === 0 ? 1.5 : 0.8} height="12" fill="#000" />
      ))}
    </svg>
  </CardBadge>
);

export const PaymentBadges = ({ variant = "light" }: Props) => (
  <div
    className={
      "flex flex-wrap items-center gap-1.5 " +
      (variant === "dark" ? "text-cream/80" : "text-ink/70")
    }
  >
    <PixLogo />
    <VisaLogo />
    <MasterLogo />
    <EloLogo />
    <AmexLogo />
    <HiperLogo />
    <DinersLogo />
    <DiscoverLogo />
    <BoletoLogo />
  </div>
);
