export function BreadcrumbSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://xsooi.com';

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": `${siteUrl}#about`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Contact",
        "item": `${siteUrl}#contact`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbData)
      }}
    />
  );
}
