import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display text-xl text-navy-950 mb-10 inline-block">
            HF Nexus <span className="text-gold-600">Academy</span>
          </Link>
          <h1 className="font-display text-2xl text-navy-950 mb-2">{title}</h1>
          <p className="text-sm text-ink-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>

      <div className="hidden lg:block relative bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <svg viewBox="0 0 400 600" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 6 }).map((_, row) =>
              Array.from({ length: 4 }).map((_, col) => (
                <path
                  key={`${row}-${col}`}
                  d={`M ${col * 100 + 10} ${row * 100 + 90} Q ${col * 100 + 50} ${row * 100 + 20} ${col * 100 + 90} ${row * 100 + 90}`}
                  stroke="#E3CD96"
                  strokeWidth="1.5"
                  fill="none"
                />
              ))
            )}
          </svg>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-12">
          <p className="font-display text-gold-300 text-3xl leading-snug max-w-md italic">
            &ldquo;Whoever travels a path seeking knowledge, Allah makes easy for him a
            path to Paradise.&rdquo;
          </p>
          <p className="mt-6 text-cream-50/50 text-sm tracking-wide">— Sahih Muslim</p>
        </div>
      </div>
    </div>
  );
}
