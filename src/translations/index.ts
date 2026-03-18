export type Language = 'nl' | 'en' | 'pl';

export interface Translation {
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    focus: string;
    mission: {
      title: string;
      text: string;
    };
    vision: {
      title: string;
      text: string;
    };
    values: {
      title: string;
      items: { title: string; description: string }[];
    };
    history: {
      title: string;
      items: { year: string; title: string; description: string }[];
    };
  };
  services: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
    detailed: {
      title: string;
      description: string;
      features: string[];
      image: string;
      stats: { label: string; value: string }[];
    }[];
    process: {
      title: string;
      steps: { title: string; description: string }[];
    };
    faq: {
      title: string;
      items: { question: string; answer: string }[];
    };
  };
  whyUs: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  portfolio: {
    title: string;
    filterAll: string;
    filterWindows: string;
    filterDoors: string;
    filterHST: string;
    filterRoof: string;
    filterCladding: string;
  };
  process: {
    title: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
  testimonials: {
    title: string;
    items: {
      name: string;
      service: string;
      text: string;
    }[];
  };
  contact: {
    title: string;
    formName: string;
    formEmail: string;
    formPhone: string;
    formService: string;
    formMessage: string;
    formSubmit: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderPhone: string;
    placeholderMessage: string;
    successMessage: string;
    errorMessage: string;
    validationEmail: string;
    validationRequired: string;
    sendEmail: string;
    sendWhatsApp: string;
    infoTitle: string;
    hours: string;
  };
  footer: {
    rights: string;
  };
  slogans: string[];
  ui: {
    heroBadge: string;
    statsExperience: string;
    statsProjects: string;
    statsWarranty: string;
    statsSatisfaction: string;
    aboutHeading: string;
    aboutBrand: string;
    missionHeading: string;
    missionHeadingSub: string;
    visionHeading: string;
    visionHeadingSub: string;
    precisionValue: string;
    precisionText: string;
    valuesSubtitle: string;
    historyDesc: string;
    ctaHeading: string;
    ctaHeadingSub: string;
    ctaButton: string;
    servicesBadge: string;
    servicesHeroTitle: string;
    servicesHeroTitleSub: string;
    servicesHeroSubtitle: string;
    discoverMore: string;
    focusLabel: string;
    contactIntro: string;
    phoneLabel: string;
    emailLabel: string;
    locationLabel: string;
    hoursLabel: string;
    footerDesc: string;
    linksTitle: string;
    servicesFooterTitle: string;
    privacyPolicy: string;
    termsOfService: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundButton: string;
  };
}

export const translations: Record<Language, Translation> = {
  nl: {
    nav: {
      home: 'Home',
      about: 'Over ons',
      services: 'Diensten',
      portfolio: 'Projecten',
      contact: 'Contact',
    },
    hero: {
      title: 'Vakmanschap in Ramen, Deuren & Gevels',
      subtitle: 'Premium kwaliteit montage en afwerking voor uw woning. Specialist in HST systemen, dakramen en Keralit gevelbekleding.',
      ctaPrimary: 'Offerte aanvragen',
      ctaSecondary: 'Contact opnemen',
    },
    about: {
      title: 'Over JuniorJob Onderhoud',
      subtitle: 'Kwaliteit zonder compromis',
      description: 'JuniorJob Onderhoud is een modern bouw- en renovatiebedrijf gevestigd in Nederland. Wij onderscheiden ons door een passie voor detail en een focus op hoogwaardige afwerking.',
      focus: 'Onze expertise ligt bij het vervangen van ramen, het monteren van deuren, HST schuifsystemen, dakramen en duurzame Keralit gevelbekleding.',
      mission: {
        title: 'Onze Missie',
        text: 'Het leveren van vakmanschap dat generaties lang meegaat, door gebruik te maken van de beste materialen en de nieuwste technieken.'
      },
      vision: {
        title: 'Onze Visie',
        text: 'De standaard worden in de renovatiesector door innovatie, duurzaamheid en een ongeëvenaarde klantenservice te combineren.'
      },
      values: {
        title: 'Onze Kernwaarden',
        items: [
          { title: 'Precisie', description: 'Elke millimeter telt. Wij werken met uiterste nauwkeurigheid.' },
          { title: 'Innovatie', description: 'Wij gebruiken de nieuwste gereedschappen en technieken.' },
          { title: 'Transparantie', description: 'Duidelijke communicatie en eerlijke prijzen.' },
          { title: 'Duurzaamheid', description: 'Materialen die de tand des tijds doorstaan.' }
        ]
      },
      history: {
        title: 'Onze Reis',
        items: [
          { year: '2015', title: 'De Oprichting', description: 'JuniorJob begon als een klein familiebedrijf met een focus op kozijnen.' },
          { year: '2018', title: 'Uitbreiding', description: 'Introductie van HST-systemen en Keralit gevelbekleding in ons portfolio.' },
          { year: '2021', title: 'Digitalisering', description: 'Implementatie van digitale inmeting voor 100% nauwkeurigheid.' },
          { year: '2024', title: 'Marktleider', description: 'Erkend als een van de meest innovatieve renovatiebedrijven in de regio.' }
        ]
      }
    },
    services: {
      title: 'Onze Diensten',
      items: [
        { title: 'Ramen vervangen', description: 'Hoogwaardige kunststof en aluminium kozijnen voor optimale isolatie.' },
        { title: 'Deuren montage', description: 'Vakkundige plaatsing van voordeuren, achterdeuren en binnendeuren.' },
        { title: 'HST schuifsystemen', description: 'Grote glaspartijen met soepele bediening voor een moderne uitstraling.' },
        { title: 'Dakramen plaatsen', description: 'Meer licht en ventilatie op uw zolder met professionele montage.' },
        { title: 'Binnenafwerking', description: 'Strakke afwerking van wanden na het vervangen van uw kozijnen.' },
        { title: 'Vensterbanken', description: 'Montage van diverse soorten vensterbanken voor een compleet plaatje.' },
        { title: 'Keralit gevelbekleding', description: 'Onderhoudsarme en duurzame gevelafwerking met een luxe uitstraling.' },
      ],
      detailed: [
        {
          title: 'Premium Kozijnen',
          description: 'Onze ramen combineren esthetiek met de hoogste isolatiewaarden. Wij werken met profielen die uw woning transformeren en uw energierekening verlagen.',
          features: ['HR+++ Glas standaard', 'Inbraakwerend beslag', 'Diverse kleurprofielen', 'Perfecte geluidsisolatie'],
          image: '/project-1.jpeg',
          stats: [{ label: 'Isolatie', value: 'U-waarde 0.8' }, { label: 'Garantie', value: '15 Jaar' }]
        },
        {
          title: 'HST Schuifsystemen',
          description: 'Breng buiten naar binnen met onze Hebe-Schiebe-Tür systemen. Ontworpen voor maximale glasoppervlakken en moeiteloze bediening.',
          features: ['Drempelloze overgang', 'Tot 6 meter breedte', 'Soft-close technologie', 'Extreem windbestendig'],
          image: '/project-2.jpeg',
          stats: [{ label: 'Breedte', value: 'Tot 6m' }, { label: 'Gewicht', value: '400kg/vleugel' }]
        },
        {
          title: 'Keralit Gevelbekleding',
          description: 'De ultieme oplossing voor een onderhoudsvrije gevel. Keralit biedt de look van hout met de duurzaamheid van hoogwaardig kunststof.',
          features: ['Nooit meer schilderen', 'Kleurvast & UV-bestendig', 'Onzichtbare montage', 'Milieuvriendelijk'],
          image: '/project-3.jpeg',
          stats: [{ label: 'Levensduur', value: '30+ Jaar' }, { label: 'Onderhoud', value: 'Minimaal' }]
        }
      ],
      process: {
        title: 'Onze Werkwijze',
        steps: [
          { title: 'Consultatie', description: 'We bespreken uw wensen en adviseren over de beste materialen.' },
          { title: 'Inmeten', description: 'Onze experts komen langs voor een nauwkeurige digitale meting.' },
          { title: 'Productie', description: 'Uw kozijnen worden op maat gemaakt met de nieuwste CNC-technologie.' },
          { title: 'Montage', description: 'Vakkundige plaatsing door onze eigen gecertificeerde monteurs.' },
          { title: 'Afwerking', description: 'Totale binnen- en buitenafwerking voor een perfect resultaat.' }
        ]
      },
      faq: {
        title: 'Veelgestelde Vragen',
        items: [
          { question: 'Hoe lang duurt het vervangen van ramen?', answer: 'Gemiddeld duurt het 1 tot 3 dagen, afhankelijk van de hoeveelheid kozijnen.' },
          { question: 'Werken jullie ook in de winter?', answer: 'Ja, wij werken het hele jaar door. We vervangen de kozijnen één voor één om warmteverlies te minimaliseren.' },
          { question: 'Zit er garantie op de montage?', answer: 'Zeker, wij geven 10 jaar volledige garantie op onze montagewerkzaamheden.' }
        ]
      }
    },
    whyUs: {
      title: 'Waarom kiezen voor ons?',
      items: [
        { title: 'Nette afwerking', description: 'Wij laten uw woning pas achter als alles tot in de puntjes is afgewerkt.' },
        { title: 'Betrouwbare service', description: 'Afspraak is afspraak. Wij communiceren helder en komen onze beloftes na.' },
        { title: 'Oog voor detail', description: 'Het verschil zit in de details. Wij streven naar perfectie in elk project.' },
        { title: 'Duurzame materialen', description: 'Wij werken uitsluitend met A-merk materialen voor een langdurig resultaat.' },
        { title: 'Strakke montage', description: 'Onze monteurs zijn ervaren en werken volgens de hoogste standaarden.' },
        { title: 'Duidelijke communicatie', description: 'Geen verrassingen achteraf. U weet precies waar u aan toe bent.' },
      ],
    },
    portfolio: {
      title: 'Onze Realisaties',
      filterAll: 'Alles',
      filterWindows: 'Ramen',
      filterDoors: 'Deuren',
      filterHST: 'HST',
      filterRoof: 'Dakramen',
      filterCladding: 'Gevels',
    },
    process: {
      title: 'Hoe wij werken',
      steps: [
        { title: 'Aanvraag', description: 'U vraagt een offerte aan via onze website of telefoon.' },
        { title: 'Afspraak', description: 'Wij komen langs voor een vrijblijvend adviesgesprek en inmeten.' },
        { title: 'Uitvoering', description: 'Onze vakmensen voeren de werkzaamheden vakkundig uit.' },
        { title: 'Oplevering', description: 'Gezamenlijke controle en oplevering van het project.' },
      ],
    },
    testimonials: {
      title: 'Wat klanten zeggen',
      items: [
        { name: 'Jan de Vries', service: 'Ramen vervangen', text: 'Zeer tevreden over de montage. Alles is heel netjes afgewerkt en de communicatie was top.' },
        { name: 'Sanne Bakker', service: 'Keralit gevelbekleding', text: 'Onze gevel ziet er weer als nieuw uit. JuniorJob werkt erg nauwkeurig.' },
        { name: 'Pieter Smit', service: 'HST Schuifpui', text: 'Prachtig resultaat. De schuifpui loopt heel soepel en de afwerking binnen is perfect.' },
      ],
    },
    contact: {
      title: 'Neem contact op',
      formName: 'Naam',
      formEmail: 'E-mail',
      formPhone: 'Telefoonnummer',
      formService: 'Soort dienst',
      formMessage: 'Uw bericht',
      formSubmit: 'Verstuur aanvraag',
      placeholderName: 'bijv. Jan de Vries',
      placeholderEmail: 'bijv. jan@example.com',
      placeholderPhone: 'bijv. +31 6 1234 5678',
      placeholderMessage: 'bijv. Ik wil graag mijn ramen vervangen door kunststof kozijnen...',
      successMessage: 'Bedankt! Uw bericht is succesvol verzonden.',
      errorMessage: 'Oeps! Er is iets misgegaan. Probeer het later opnieuw.',
      validationEmail: 'Voer een geldig e-mailadres in.',
      validationRequired: 'Dit veld is verplicht.',
      sendEmail: 'Verstuur via E-mail',
      sendWhatsApp: 'Verstuur via WhatsApp',
      infoTitle: 'Contactgegevens',
      hours: 'Maandag - Vrijdag: 08:00 - 18:00',
    },
    footer: {
      rights: 'Alle rechten voorbehouden.',
    },
    slogans: [
      "Kwaliteit zonder compromis.",
      "Vakmanschap tot in het kleinste detail.",
      "Uw woning, onze passie voor perfectie.",
      "Betrouwbaar onderhoud, strakke resultaten.",
      "Duurzaam bouwen aan uw wooncomfort."
    ],
    ui: {
      heroBadge: 'Premium Montage & Onderhoud',
      statsExperience: 'Ervaring',
      statsProjects: 'Projecten',
      statsWarranty: 'Garantie',
      statsSatisfaction: 'Klanttevredenheid',
      aboutHeading: 'Wij zijn',
      aboutBrand: 'JuniorJob.',
      missionHeading: 'Vakmanschap dat',
      missionHeadingSub: 'generaties overleeft.',
      visionHeading: 'Innovatie in',
      visionHeadingSub: 'elke verbinding.',
      precisionValue: '100%',
      precisionText: 'Focus op digitale inmeting en precisie-montage voor elk project.',
      valuesSubtitle: 'Onze Fundamenten',
      historyDesc: 'Van een klein familiebedrijf tot een innovatieve marktleider in renovatie.',
      ctaHeading: 'Word onderdeel van',
      ctaHeadingSub: 'ons verhaal.',
      ctaButton: 'Start Uw Project',
      servicesBadge: 'Onze Expertise',
      servicesHeroTitle: 'Vakmanschap',
      servicesHeroTitleSub: 'Zonder Grenzen.',
      servicesHeroSubtitle: 'Wij herdefiniëren woningonderhoud met precisie-engineering en een obsessie voor detail. Van HST-systemen tot Keralit gevels.',
      discoverMore: 'Ontdek meer',
      focusLabel: 'Focus',
      contactIntro: 'Klaar om uw woning te transformeren? Vul het formulier in en wij nemen binnen 24 uur contact met u op voor een vrijblijvende offerte.',
      phoneLabel: 'Telefoon',
      emailLabel: 'E-mail',
      locationLabel: 'Locatie',
      hoursLabel: 'Openingstijden',
      footerDesc: 'Uw partner voor hoogwaardige renovatie en onderhoud in Nederland. Wij combineren vakmanschap met moderne technieken.',
      linksTitle: 'Links',
      servicesFooterTitle: 'Diensten',
      privacyPolicy: 'Privacybeleid',
      termsOfService: 'Algemene Voorwaarden',
      notFoundTitle: 'Pagina niet gevonden',
      notFoundText: 'De pagina die u zoekt bestaat niet of is verplaatst.',
      notFoundButton: 'Terug naar Home',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    hero: {
      title: 'Craftsmanship in Windows, Doors & Facades',
      subtitle: 'Premium quality installation and finishing for your home. Specialist in HST systems, roof windows, and Keralit cladding.',
      ctaPrimary: 'Request Quote',
      ctaSecondary: 'Get in Touch',
    },
    about: {
      title: 'About JuniorJob Onderhoud',
      subtitle: 'Quality without compromise',
      description: 'JuniorJob Onderhoud is a modern construction and renovation company based in the Netherlands. We distinguish ourselves through a passion for detail and a focus on high-quality finishing.',
      focus: 'Our expertise lies in window replacement, door installation, HST sliding systems, roof windows, and sustainable Keralit cladding.',
      mission: {
        title: 'Our Mission',
        text: 'Delivering craftsmanship that lasts for generations, by using the best materials and the latest techniques.'
      },
      vision: {
        title: 'Our Vision',
        text: 'To become the standard in the renovation sector by combining innovation, sustainability and unparalleled customer service.'
      },
      values: {
        title: 'Our Core Values',
        items: [
          { title: 'Precision', description: 'Every millimeter counts. We work with extreme accuracy.' },
          { title: 'Innovation', description: 'We use the latest tools and techniques.' },
          { title: 'Transparency', description: 'Clear communication and fair prices.' },
          { title: 'Sustainability', description: 'Materials that stand the test of time.' }
        ]
      },
      history: {
        title: 'Our Journey',
        items: [
          { year: '2015', title: 'The Foundation', description: 'JuniorJob started as a small family business with a focus on window frames.' },
          { year: '2018', title: 'Expansion', description: 'Introduction of HST systems and Keralit cladding in our portfolio.' },
          { year: '2021', title: 'Digitalization', description: 'Implementation of digital measurement for 100% accuracy.' },
          { year: '2024', title: 'Market Leader', description: 'Recognized as one of the most innovative renovation companies in the region.' }
        ]
      }
    },
    services: {
      title: 'Our Services',
      items: [
        { title: 'Window Replacement', description: 'High-quality plastic and aluminum frames for optimal insulation.' },
        { title: 'Door Installation', description: 'Professional installation of front, back, and interior doors.' },
        { title: 'HST Sliding Systems', description: 'Large glass surfaces with smooth operation for a modern look.' },
        { title: 'Roof Windows', description: 'More light and ventilation in your attic with professional installation.' },
        { title: 'Interior Finishing', description: 'Sleek finishing of walls after replacing your window frames.' },
        { title: 'Windowsills', description: 'Installation of various types of windowsills for a complete look.' },
        { title: 'Keralit Cladding', description: 'Low-maintenance and sustainable facade finishing with a luxury look.' },
      ],
      detailed: [
        {
          title: 'Premium Windows',
          description: 'Our windows combine aesthetics with the highest insulation values. We work with profiles that transform your home and lower your energy bills.',
          features: ['HR+++ Glass standard', 'Burglary-resistant hardware', 'Various color profiles', 'Perfect sound insulation'],
          image: '/project-1.jpeg',
          stats: [{ label: 'Insulation', value: 'U-value 0.8' }, { label: 'Warranty', value: '15 Years' }]
        },
        {
          title: 'HST Sliding Systems',
          description: 'Bring the outside in with our Hebe-Schiebe-Tür systems. Designed for maximum glass surfaces and effortless operation.',
          features: ['Threshold-less transition', 'Up to 6 meters wide', 'Soft-close technology', 'Extremely wind resistant'],
          image: '/project-2.jpeg',
          stats: [{ label: 'Width', value: 'Up to 6m' }, { label: 'Weight', value: '400kg/wing' }]
        },
        {
          title: 'Keralit Cladding',
          description: 'The ultimate solution for a maintenance-free facade. Keralit offers the look of wood with the durability of high-quality plastic.',
          features: ['Never paint again', 'Colorfast & UV resistant', 'Invisible installation', 'Environmentally friendly'],
          image: '/project-3.jpeg',
          stats: [{ label: 'Lifespan', value: '30+ Years' }, { label: 'Maintenance', value: 'Minimal' }]
        }
      ],
      process: {
        title: 'Our Working Method',
        steps: [
          { title: 'Consultation', description: 'We discuss your wishes and advise on the best materials.' },
          { title: 'Measurement', description: 'Our experts visit for an accurate digital measurement.' },
          { title: 'Production', description: 'Your frames are custom-made using the latest CNC technology.' },
          { title: 'Installation', description: 'Professional installation by our own certified technicians.' },
          { title: 'Finishing', description: 'Total interior and exterior finishing for a perfect result.' }
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          { question: 'How long does it take to replace windows?', answer: 'On average it takes 1 to 3 days, depending on the number of frames.' },
          { question: 'Do you also work in winter?', answer: 'Yes, we work all year round. We replace the frames one by one to minimize heat loss.' },
          { question: 'Is there a warranty on the installation?', answer: 'Certainly, we provide a 10-year full warranty on our installation work.' }
        ]
      }
    },
    whyUs: {
      title: 'Why Choose Us?',
      items: [
        { title: 'Neat Finishing', description: 'We only leave your home when everything is finished to perfection.' },
        { title: 'Reliable Service', description: 'A deal is a deal. We communicate clearly and keep our promises.' },
        { title: 'Eye for Detail', description: 'The difference is in the details. We strive for perfection in every project.' },
        { title: 'Durable Materials', description: 'We work exclusively with A-brand materials for long-lasting results.' },
        { title: 'Precise Installation', description: 'Our installers are experienced and work to the highest standards.' },
        { title: 'Clear Communication', description: 'No surprises afterwards. You know exactly what to expect.' },
      ],
    },
    portfolio: {
      title: 'Our Projects',
      filterAll: 'All',
      filterWindows: 'Windows',
      filterDoors: 'Doors',
      filterHST: 'HST',
      filterRoof: 'Roof Windows',
      filterCladding: 'Cladding',
    },
    process: {
      title: 'Our Process',
      steps: [
        { title: 'Request', description: 'You request a quote via our website or phone.' },
        { title: 'Appointment', description: 'We visit for a non-binding consultation and measurement.' },
        { title: 'Execution', description: 'Our craftsmen carry out the work professionally.' },
        { title: 'Delivery', description: 'Joint inspection and delivery of the project.' },
      ],
    },
    testimonials: {
      title: 'What Clients Say',
      items: [
        { name: 'Jan de Vries', service: 'Window Replacement', text: 'Very satisfied with the installation. Everything is very neatly finished and communication was great.' },
        { name: 'Sanne Bakker', service: 'Keralit Cladding', text: 'Our facade looks like new again. JuniorJob works very accurately.' },
        { name: 'Pieter Smit', service: 'HST Sliding Door', text: 'Beautiful result. The sliding door runs very smoothly and the interior finish is perfect.' },
      ],
    },
    contact: {
      title: 'Contact Us',
      formName: 'Name',
      formEmail: 'Email',
      formPhone: 'Phone Number',
      formService: 'Service Type',
      formMessage: 'Your Message',
      formSubmit: 'Send Request',
      placeholderName: 'e.g. John Doe',
      placeholderEmail: 'e.g. john@example.com',
      placeholderPhone: 'e.g. +31 6 1234 5678',
      placeholderMessage: 'e.g. I would like to replace my windows with PVC frames...',
      successMessage: 'Thank you! Your message has been sent successfully.',
      errorMessage: 'Oops! Something went wrong. Please try again later.',
      validationEmail: 'Please enter a valid email address.',
      validationRequired: 'This field is required.',
      sendEmail: 'Send via Email',
      sendWhatsApp: 'Send via WhatsApp',
      infoTitle: 'Contact Details',
      hours: 'Monday - Friday: 08:00 - 18:00',
    },
    footer: {
      rights: 'All rights reserved.',
    },
    slogans: [
      "Quality without compromise.",
      "Craftsmanship in every detail.",
      "Your home, our passion for perfection.",
      "Reliable maintenance, sleek results.",
      "Sustainably building your living comfort."
    ],
    ui: {
      heroBadge: 'Premium Installation & Maintenance',
      statsExperience: 'Experience',
      statsProjects: 'Projects',
      statsWarranty: 'Warranty',
      statsSatisfaction: 'Client Satisfaction',
      aboutHeading: 'We are',
      aboutBrand: 'JuniorJob.',
      missionHeading: 'Craftsmanship that',
      missionHeadingSub: 'lasts generations.',
      visionHeading: 'Innovation in',
      visionHeadingSub: 'every connection.',
      precisionValue: '100%',
      precisionText: 'Focus on digital measurement and precision installation for every project.',
      valuesSubtitle: 'Our Foundations',
      historyDesc: 'From a small family business to an innovative market leader in renovation.',
      ctaHeading: 'Become part of',
      ctaHeadingSub: 'our story.',
      ctaButton: 'Start Your Project',
      servicesBadge: 'Our Expertise',
      servicesHeroTitle: 'Craftsmanship',
      servicesHeroTitleSub: 'Without Limits.',
      servicesHeroSubtitle: 'We redefine home maintenance with precision engineering and an obsession for detail. From HST systems to Keralit facades.',
      discoverMore: 'Discover more',
      focusLabel: 'Focus',
      contactIntro: 'Ready to transform your home? Fill in the form and we will contact you within 24 hours for a free quote.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      locationLabel: 'Location',
      hoursLabel: 'Opening Hours',
      footerDesc: 'Your partner for high-quality renovation and maintenance in the Netherlands. We combine craftsmanship with modern techniques.',
      linksTitle: 'Links',
      servicesFooterTitle: 'Services',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      notFoundTitle: 'Page not found',
      notFoundText: 'The page you are looking for does not exist or has been moved.',
      notFoundButton: 'Back to Home',
    },
  },
  pl: {
    nav: {
      home: 'Start',
      about: 'O nas',
      services: 'Usługi',
      portfolio: 'Realizacje',
      contact: 'Kontakt',
    },
    hero: {
      title: 'Mistrzostwo w Oknach, Drzwiach i Elewacjach',
      subtitle: 'Premium jakość montażu i wykończenia dla Twojego domu. Specjaliści w systemach HST, oknach dachowych i elewacjach Keralit.',
      ctaPrimary: 'Poproś o wycenę',
      ctaSecondary: 'Skontaktuj się',
    },
    about: {
      title: 'O JuniorJob Onderhoud',
      subtitle: 'Jakość bez kompromisów',
      description: 'JuniorJob Onderhoud to nowoczesna firma budowlano-remontowa działająca w Holandii. Wyróżniamy się pasją do detali i naciskiem na wysoką jakość wykończenia.',
      focus: 'Nasza wiedza obejmuje wymianę okien, montaż drzwi, systemy przesuwne HST, okna dachowe oraz trwałe elewacje Keralit.',
      mission: {
        title: 'Nasza Misja',
        text: 'Dostarczanie rzemiosła, które przetrwa pokolenia, przy użyciu najlepszych materiałów i najnowszych technik.'
      },
      vision: {
        title: 'Nasza Wizja',
        text: 'Stać się standardem w sektorze renowacji poprzez połączenie innowacji, zrównoważonego rozwoju i niezrównanej obsługi klienta.'
      },
      values: {
        title: 'Nasze Wartości',
        items: [
          { title: 'Precyzja', description: 'Liczy się każdy milimetr. Pracujemy z najwyższą dokładnością.' },
          { title: 'Innowacja', description: 'Używamy najnowszych narzędzi i technik.' },
          { title: 'Przejrzystość', description: 'Jasna komunikacja i uczciwe ceny.' },
          { title: 'Zrównoważony Rozwój', description: 'Materiały, które przetrwają próbę czasu.' }
        ]
      },
      history: {
        title: 'Nasza Podróż',
        items: [
          { year: '2015', title: 'Założenie', description: 'JuniorJob zaczynał jako mała rodzinna firma skupiająca się na ramach okiennych.' },
          { year: '2018', title: 'Ekspansja', description: 'Wprowadzenie systemów HST i okładzin Keralit do naszego portfolio.' },
          { year: '2021', title: 'Digitalizacja', description: 'Wdrożenie pomiarów cyfrowych dla 100% dokładności.' },
          { year: '2024', title: 'Lider Rynku', description: 'Uznany za jedną z najbardziej innowacyjnych firm remontowych w regionie.' }
        ]
      }
    },
    services: {
      title: 'Nasze Usługi',
      items: [
        { title: 'Wymiana okien', description: 'Wysokiej jakości ramy PCV i aluminiowe dla optymalnej izolacji.' },
        { title: 'Montaż drzwi', description: 'Profesjonalny montaż drzwi wejściowych, tylnych i wewnętrznych.' },
        { title: 'Systemy HST', description: 'Duże powierzchnie szklane z płynną obsługą dla nowoczesnego wyglądu.' },
        { title: 'Okna dachowe', description: 'Więcej światła i wentylacji na poddaszu dzięki profesjonalnemu montażowi.' },
        { title: 'Wykończenie wnętrz', description: 'Gładkie wykończenie ścian po wymianie ram okiennych.' },
        { title: 'Parapety', description: 'Montaż różnych rodzajów parapetów dla kompletnego wyglądu.' },
        { title: 'Elewacje Keralit', description: 'Niskonakładowe i trwałe wykończenie elewacji o luksusowym wyglądzie.' },
      ],
      detailed: [
        {
          title: 'Okna Premium',
          description: 'Nasze okna łączą estetykę z najwyższymi parametrami izolacyjnymi. Pracujemy na profilach, które odmienią Twój dom i obniżą rachunki za energię.',
          features: ['Szklenie HR+++ w standardzie', 'Okucia antywłamaniowe', 'Bogata paleta kolorów', 'Doskonała izolacja akustyczna'],
          image: '/project-1.jpeg',
          stats: [{ label: 'Izolacja', value: 'U-value 0.8' }, { label: 'Gwarancja', value: '15 Lat' }]
        },
        {
          title: 'Systemy HST',
          description: 'Wprowadź ogród do wnętrza dzięki naszym systemom Hebe-Schiebe-Tür. Zaprojektowane dla maksymalnych przeszkleń i lekkiej obsługi.',
          features: ['Próg zlicowany z podłogą', 'Szerokość do 6 metrów', 'Technologia Soft-close', 'Ekstremalna odporność na wiatr'],
          image: '/project-2.jpeg',
          stats: [{ label: 'Szerokość', value: 'Do 6m' }, { label: 'Waga', value: '400kg/skrzydło' }]
        },
        {
          title: 'Elewacje Keralit',
          description: 'Ostateczne rozwiązanie dla bezobsługowej elewacji. Keralit oferuje wygląd drewna przy trwałości wysokiej jakości tworzywa.',
          features: ['Nigdy więcej malowania', 'Trwałość koloru & UV', 'Niewidoczny montaż', 'Przyjazne dla środowiska'],
          image: '/project-3.jpeg',
          stats: [{ label: 'Żywotność', value: '30+ Lat' }, { label: 'Konserwacja', value: 'Minimalna' }]
        }
      ],
      process: {
        title: 'Nasza Metoda Pracy',
        steps: [
          { title: 'Konsultacja', description: 'Omawiamy Twoje życzenia i doradzamy w wyborze najlepszych materiałów.' },
          { title: 'Pomiar', description: 'Nasi eksperci odwiedzają Cię w celu dokładnego pomiaru cyfrowego.' },
          { title: 'Produkcja', description: 'Twoje ramy są wykonywane na wymiar przy użyciu najnowszej technologii CNC.' },
          { title: 'Montaż', description: 'Profesjonalny montaż przez naszych własnych certyfikowanych techników.' },
          { title: 'Wykończenie', description: 'Całkowite wykończenie wewnętrzne i zewnętrzne dla idealnego rezultatu.' }
        ]
      },
      faq: {
        title: 'Często Zadawane Pytania',
        items: [
          { question: 'Jak długo trwa wymiana okien?', answer: 'Średnio zajmuje to od 1 do 3 dni, w zależności od liczby ram.' },
          { question: 'Czy pracujecie również zimą?', answer: 'Tak, pracujemy przez cały rok. Wymieniamy ramy jedna po drugiej, aby zminimalizować straty ciepła.' },
          { question: 'Czy jest gwarancja na montaż?', answer: 'Oczywiście, udzielamy 10-letniej pełnej gwarancji na nasze prace montażowe.' }
        ]
      }
    },
    whyUs: {
      title: 'Dlaczego my?',
      items: [
        { title: 'Czyste wykończenie', description: 'Opuszczamy Twój dom dopiero wtedy, gdy wszystko jest wykończone do perfekcji.' },
        { title: 'Niezawodny serwis', description: 'Umowa to umowa. Komunikujemy się jasno i dotrzymujemy obietnic.' },
        { title: 'Dbałość o detale', description: 'Różnica tkwi w szczegółach. Dążymy do perfekcji w każdym projekcie.' },
        { title: 'Trwałe materiały', description: 'Pracujemy wyłącznie z materiałami marek premium dla długotrwałych efektów.' },
        { title: 'Precyzyjny montaż', description: 'Nasi monterzy są doświadczeni i pracują według najwyższych standardów.' },
        { title: 'Jasna komunikacja', description: 'Brak niespodzianek po fakcie. Wiesz dokładnie, czego się spodziewać.' },
      ],
    },
    portfolio: {
      title: 'Nasze Realizacje',
      filterAll: 'Wszystkie',
      filterWindows: 'Okna',
      filterDoors: 'Drzwi',
      filterHST: 'HST',
      filterRoof: 'Okna dachowe',
      filterCladding: 'Elewacje',
    },
    process: {
      title: 'Jak pracujemy',
      steps: [
        { title: 'Zapytanie', description: 'Prosisz o wycenę przez naszą stronę lub telefonicznie.' },
        { title: 'Spotkanie', description: 'Odwiedzamy Cię w celu bezpłatnej konsultacji i pomiarów.' },
        { title: 'Realizacja', description: 'Nasi fachowcy profesjonalnie wykonują zlecone prace.' },
        { title: 'Odbiór', description: 'Wspólna kontrola i przekazanie gotowego projektu.' },
      ],
    },
    testimonials: {
      title: 'Opinie Klientolw',
      items: [
        { name: 'Jan de Vries', service: 'Wymiana okien', text: 'Bardzo zadowolony z montażu. Wszystko bardzo czysto wykończone, a komunikacja była świetna.' },
        { name: 'Sanne Bakker', service: 'Elewacje Keralit', text: 'Nasza elewacja znów wygląda jak nowa. JuniorJob pracuje bardzo dokładnie.' },
        { name: 'Pieter Smit', service: 'Drzwi przesuwne HST', text: 'Piękny wynik. Drzwi przesuwne działają bardzo płynnie, a wykończenie wewnątrz jest idealne.' },
      ],
    },
    contact: {
      title: 'Kontakt',
      formName: 'Imię',
      formEmail: 'E-mail',
      formPhone: 'Numer telefonu',
      formService: 'Rodzaj usługi',
      formMessage: 'Twoja wiadomość',
      formSubmit: 'Wyślij zapytanie',
      placeholderName: 'np. Jan Kowalski',
      placeholderEmail: 'np. jan@example.com',
      placeholderPhone: 'np. +31 6 1234 5678',
      placeholderMessage: 'np. Chciałbym zapytać o wymianę okien i montaż drzwi...',
      successMessage: 'Dziękujemy! Twoja wiadomość została wysłana pomyślnie.',
      errorMessage: 'Ups! Coś poszło nie tak. Spróbuj ponownie później.',
      validationEmail: 'Proszę podać poprawny adres e-mail.',
      validationRequired: 'To pole jest wymagane.',
      sendEmail: 'Wyślij przez E-mail',
      sendWhatsApp: 'Wyślij przez WhatsApp',
      infoTitle: 'Dane kontaktowe',
      hours: 'Poniedziałek - Piątek: 08:00 - 18:00',
    },
    footer: {
      rights: 'Wszelkie prawa zastrzeżone.',
    },
    slogans: [
      "Jakość bez kompromisów.",
      "Mistrzostwo w każdym detalu.",
      "Twój dom, nasza pasja do perfekcji.",
      "Niezawodna konserwacja, czyste rezultaty.",
      "Trwałe budowanie Twojego komfortu życia."
    ],
    ui: {
      heroBadge: 'Profesjonalny Montaż i Konserwacja',
      statsExperience: 'Doświadczenie',
      statsProjects: 'Projekty',
      statsWarranty: 'Gwarancja',
      statsSatisfaction: 'Zadowolenie Klientów',
      aboutHeading: 'Jesteśmy',
      aboutBrand: 'JuniorJob.',
      missionHeading: 'Rzemiosło, które',
      missionHeadingSub: 'przetrwa pokolenia.',
      visionHeading: 'Innowacja w',
      visionHeadingSub: 'każdym połączeniu.',
      precisionValue: '100%',
      precisionText: 'Skupienie na pomiarach cyfrowych i precyzyjnym montażu w każdym projekcie.',
      valuesSubtitle: 'Nasze Fundamenty',
      historyDesc: 'Od małej firmy rodzinnej do innowacyjnego lidera rynku renowacji.',
      ctaHeading: 'Zostań częścią',
      ctaHeadingSub: 'naszej historii.',
      ctaButton: 'Rozpocznij Swój Projekt',
      servicesBadge: 'Nasza Wiedza',
      servicesHeroTitle: 'Rzemiosło',
      servicesHeroTitleSub: 'Bez Granic.',
      servicesHeroSubtitle: 'Na nowo definiujemy konserwację domów dzięki precyzyjnej inżynierii i obsesji na punkcie detali. Od systemów HST po elewacje Keralit.',
      discoverMore: 'Dowiedz się więcej',
      focusLabel: 'Fokus',
      contactIntro: 'Gotowy na przemianę swojego domu? Wypełnij formularz, a skontaktujemy się z Tobą w ciągu 24 godzin z bezpłatną wyceną.',
      phoneLabel: 'Telefon',
      emailLabel: 'E-mail',
      locationLabel: 'Lokalizacja',
      hoursLabel: 'Godziny otwarcia',
      footerDesc: 'Twój partner w zakresie wysokiej jakości renowacji i konserwacji w Holandii. Łączymy rzemiosło z nowoczesnymi technikami.',
      linksTitle: 'Linki',
      servicesFooterTitle: 'Usługi',
      privacyPolicy: 'Polityka Prywatności',
      termsOfService: 'Regulamin',
      notFoundTitle: 'Strona nie znaleziona',
      notFoundText: 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
      notFoundButton: 'Powrót na Stronę Główną',
    },
  },
};
