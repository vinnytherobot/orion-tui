import { cn } from '@/lib/utils';

interface OrionLogoProps {
  className?: string;
  size?: number;
  withWordmark?: boolean;
}

export function OrionLogo({ className, size = 28, withWordmark = false }: OrionLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-foreground"
        />
        <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="hsl(var(--primary))" />
      </svg>
      {withWordmark && <span className="font-semibold tracking-tight text-foreground">Orion</span>}
    </span>
  );
}
