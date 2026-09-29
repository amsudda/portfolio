import { company, site, socials } from "@/content/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: site.name,
        legalName: company.legalName,
        url: site.url,
        email: company.email,
        telephone: company.phone,
        foundingDate: String(site.foundedYear),
        description: site.description,
        address: {
          "@type": "PostalAddress",
          streetAddress: "No. 42, Level 3, Duplication Road",
          addressLocality: "Colombo 04",
          addressCountry: company.country,
        },
        sameAs: socials.map((s) => s.href),
      }}
    />
  );
}

export function CaseStudyJsonLd({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        headline: title,
        description,
        url,
        creator: { "@type": "Organization", name: site.name },
      }}
    />
  );
}
