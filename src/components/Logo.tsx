interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}

export function Logo({
  className = "",
  markClassName = "h-6 w-auto sm:h-7",
  textClassName = "text-sm text-ink sm:text-[15px]",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-mark.png" alt="" className={`${markClassName} shrink-0 object-contain`} />
      <span className={`whitespace-nowrap font-semibold tracking-tight ${textClassName}`}>
        Astera Banking
      </span>
    </span>
  );
}
