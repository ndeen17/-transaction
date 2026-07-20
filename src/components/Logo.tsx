interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}

export function Logo({
  className = "",
  markClassName = "h-7 w-auto",
  textClassName = "text-[15px]",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/logo-mark.png" alt="" className={`${markClassName} object-contain`} />
      <span className={`font-semibold tracking-tight text-ink ${textClassName}`}>
        Astera Banking
      </span>
    </span>
  );
}
