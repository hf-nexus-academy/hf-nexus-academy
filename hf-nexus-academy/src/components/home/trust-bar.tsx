const COUNTRIES_SAMPLE = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "UAE",
  "Saudi Arabia",
  "Sweden",
];

export function TrustBar() {
  return (
    <section className="bg-cream-100 border-b border-ink-300/15">
      <div className="container py-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-500 mb-5">
          Trusted by students learning from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {COUNTRIES_SAMPLE.map((country) => (
            <span key={country} className="text-sm font-medium text-navy-800/70 font-display">
              {country}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
