export default function Logo({ width = 148 }: { width?: number }) {
  const h = Math.round(width * 0.42);
  return (
    <svg viewBox="0 0 220 92" width={width} height={h} style={{ display: 'block' }} aria-label="AutoDriva">
      <ellipse cx="110" cy="46" rx="106" ry="40" fill="none" stroke="white" strokeWidth="2.2" />
      <line x1="28" y1="66" x2="192" y2="26" stroke="#1e6ef4" strokeWidth="2.5" strokeLinecap="round" />
      <text x="36" y="50" fill="white" fontFamily="'Barlow Condensed',sans-serif"
        fontSize="26" fontStyle="italic" fontWeight="800" letterSpacing="0.5">Auto</text>
      <text x="116" y="68" fill="white" fontFamily="'Barlow Condensed',sans-serif"
        fontSize="26" fontStyle="italic" fontWeight="800" letterSpacing="0.5">Driva</text>
    </svg>
  );
}
