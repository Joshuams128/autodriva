interface BlueBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  outline?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function BlueBtn({
  children,
  onClick,
  outline = false,
  type = 'button',
  disabled = false,
}: BlueBtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'font-barlow text-[17px] font-bold tracking-[1.5px] uppercase',
        'px-9 py-[14px] rounded border border-accent text-white',
        'transition-all duration-200 hover:-translate-y-px',
        outline
          ? 'bg-transparent hover:bg-accent'
          : 'bg-accent hover:shadow-[0_0_30px_rgba(30,110,244,0.45)]',
        disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
