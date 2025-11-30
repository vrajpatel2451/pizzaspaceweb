/**
 * JSON-LD Structured Data Components
 * These components provide rich structured data for search engines
 * to better understand the Pizza Space business
 */

export function RestaurantJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Pizza Space',
    description: 'Authentic Italian pizza restaurant in London specializing in handcrafted pizzas made with premium ingredients',
    url: 'https://pizzaspace.co.uk',
    telephone: '+44 20 1234 5678',
    email: 'hello@pizzaspace.co.uk',
    image: 'https://pizzaspace.co.uk/og-image.jpg',
    logo: 'https://pizzaspace.co.uk/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Pizza Street',
      addressLocality: 'London',
      addressRegion: 'Greater London',
      postalCode: 'SW1A 1AA',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5074,
      longitude: -0.1278,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '23:00',
      },
    ],
    servesCuisine: ['Italian', 'Pizza', 'Mediterranean'],
    priceRange: '££',
    acceptsReservations: false,
    hasMenu: 'https://pizzaspace.co.uk/menu',
    menu: 'https://pizzaspace.co.uk/menu',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Online Payment'],
    currenciesAccepted: 'GBP',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://pizzaspace.co.uk',
    name: 'Pizza Space',
    alternateName: 'Pizza Space London',
    description: 'Premium pizza delivery and takeaway service in London, offering authentic Italian pizzas made with fresh ingredients',
    image: 'https://pizzaspace.co.uk/og-image.jpg',
    logo: {
      '@type': 'ImageObject',
      url: 'https://pizzaspace.co.uk/logo.png',
      width: 512,
      height: 512,
    },
    url: 'https://pizzaspace.co.uk',
    telephone: '+44 20 1234 5678',
    email: 'hello@pizzaspace.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Pizza Street',
      addressLocality: 'London',
      addressRegion: 'Greater London',
      postalCode: 'SW1A 1AA',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5074,
      longitude: -0.1278,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '23:00',
      },
    ],
    priceRange: '££',
    sameAs: [
      'https://www.facebook.com/pizzaspace',
      'https://www.instagram.com/pizzaspace',
      'https://twitter.com/pizzaspace',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pizza Space',
    url: 'https://pizzaspace.co.uk',
    description: 'Order delicious handcrafted pizzas from Pizza Space. Fresh ingredients, fast delivery across London.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pizzaspace.co.uk/menu?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pizza Space',
    url: 'https://pizzaspace.co.uk',
    logo: {
      '@type': 'ImageObject',
      url: 'https://pizzaspace.co.uk/logo.png',
      width: 512,
      height: 512,
    },
    description: 'London\'s premier pizza delivery service offering authentic Italian pizzas made with the finest ingredients',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44 20 1234 5678',
      contactType: 'Customer Service',
      email: 'hello@pizzaspace.co.uk',
      areaServed: 'GB',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.facebook.com/pizzaspace',
      'https://www.instagram.com/pizzaspace',
      'https://twitter.com/pizzaspace',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
