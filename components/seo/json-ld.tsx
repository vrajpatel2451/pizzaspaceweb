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

export function HomePageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://pizzaspace.co.uk/#webpage',
    url: 'https://pizzaspace.co.uk',
    name: 'Pizza Space | Authentic Italian Pizza Delivery in London',
    description: 'Order delicious handcrafted pizzas from Pizza Space. Fresh ingredients, fast delivery across London.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    about: {
      '@id': 'https://pizzaspace.co.uk/#organization',
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://pizzaspace.co.uk/og-image.jpg',
      width: 1200,
      height: 630,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function AboutPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': 'https://pizzaspace.co.uk/about/#webpage',
    url: 'https://pizzaspace.co.uk/about',
    name: 'About Us | Pizza Space',
    description: 'Learn about Pizza Space - our story, mission, and commitment to authentic Italian pizza.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    about: {
      '@id': 'https://pizzaspace.co.uk/#organization',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'About Us',
          item: 'https://pizzaspace.co.uk/about',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ContactPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://pizzaspace.co.uk/contact/#webpage',
    url: 'https://pizzaspace.co.uk/contact',
    name: 'Contact Us | Pizza Space',
    description: 'Get in touch with Pizza Space. We\'d love to hear from you.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    mainEntity: {
      '@type': 'Organization',
      name: 'Pizza Space',
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
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact',
          item: 'https://pizzaspace.co.uk/contact',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function StoresPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://pizzaspace.co.uk/stores/#webpage',
    url: 'https://pizzaspace.co.uk/stores',
    name: 'Our Stores | Pizza Space',
    description: 'Find your nearest Pizza Space location. Discover our stores across the UK.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    about: {
      '@type': 'ItemList',
      name: 'Pizza Space Store Locations',
      itemListElement: {
        '@type': 'LocalBusiness',
        name: 'Pizza Space',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Stores',
          item: 'https://pizzaspace.co.uk/stores',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function MenuPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://pizzaspace.co.uk/menu/#webpage',
    url: 'https://pizzaspace.co.uk/menu',
    name: 'Menu | Pizza Space',
    description: 'Browse our complete menu of authentic Italian pizzas, sides, drinks, and desserts.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    about: {
      '@type': 'Menu',
      name: 'Pizza Space Menu',
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: 'Pizzas',
          description: 'Authentic Italian pizzas made with fresh ingredients',
        },
        {
          '@type': 'MenuSection',
          name: 'Sides',
          description: 'Delicious sides to complement your pizza',
        },
        {
          '@type': 'MenuSection',
          name: 'Drinks',
          description: 'Refreshing beverages',
        },
        {
          '@type': 'MenuSection',
          name: 'Desserts',
          description: 'Sweet treats to finish your meal',
        },
      ],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Menu',
          item: 'https://pizzaspace.co.uk/menu',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LoginPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://pizzaspace.co.uk/login/#webpage',
    url: 'https://pizzaspace.co.uk/login',
    name: 'Login | Pizza Space',
    description: 'Sign in to your Pizza Space account to order delicious pizzas.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Login',
          item: 'https://pizzaspace.co.uk/login',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function RegisterPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://pizzaspace.co.uk/register/#webpage',
    url: 'https://pizzaspace.co.uk/register',
    name: 'Register | Pizza Space',
    description: 'Create a Pizza Space account to order delicious pizzas online.',
    isPartOf: {
      '@id': 'https://pizzaspace.co.uk/#website',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://pizzaspace.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Register',
          item: 'https://pizzaspace.co.uk/register',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
