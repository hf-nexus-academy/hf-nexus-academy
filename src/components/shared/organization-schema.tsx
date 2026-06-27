export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "HF Nexus Academy",
    url: "https://hf-nexus.com",
    description:
      "A premium online Islamic education platform offering live classes in Quran, Hadith, Fiqh, Arabic, and classical Islamic sciences.",
    sameAs: [],
    areaServed: [
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "Germany",
      "France",
      "Netherlands",
      "Sweden",
      "Norway",
      "Denmark",
      "Switzerland",
      "United Arab Emirates",
      "Saudi Arabia",
      "Qatar",
      "Kuwait",
      "Oman",
      "Bahrain",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
