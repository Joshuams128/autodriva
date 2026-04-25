import Image from 'next/image';

export default function Logo({ width = 148 }: { width?: number }) {
  return (
    <Image
      src="/imgs/logo1.png"
      alt="AutoDriva"
      width={width}
      height={Math.round(width * 0.5)}
      priority
      style={{ display: 'block' }}
    />
  );
}
