import type { PortfolioContent } from './schema';

export const enContent = {
  locale: 'en',
  navigation: {
    expertise: 'Expertise',
    work: 'Selected work',
    career: 'Career',
    contact: 'Contact',
  },
  hero: {
    eyebrow: 'Eduardo Lourenco',
    title: 'Principal AI System Architect',
    disciplines: 'AI Systems · Software Architecture · Mobile',
    summary:
      'I design AI systems and bring intelligent products to production, connecting software architecture, mobile experiences and end-to-end engineering.',
    workCta: 'View selected work',
    linkedinCta: 'Connect on LinkedIn',
    resumeCta: 'Download resume',
    capabilities: [
      { id: 'distributed', label: 'Distributed systems' },
      { id: 'mobile', label: 'Mobile' },
      { id: 'ai', label: 'Applied AI' },
      { id: 'observability', label: 'Observability' },
    ],
  },
  expertise: [
    {
      id: 'ai',
      title: 'Artificial Intelligence',
      description:
        'AI-powered products, generative experiences and intelligent workflows designed for production.',
      skills: [
        'AI products',
        'Generative experiences',
        'Intelligent workflows',
      ],
    },
    {
      id: 'mobile',
      title: 'Mobile Engineering',
      description:
        'Production mobile applications with native-quality experiences across iOS and Android.',
      skills: ['React Native', 'Swift', 'iOS', 'Android'],
    },
    {
      id: 'architecture',
      title: 'Software Architecture',
      description:
        'Resilient platforms that balance delivery speed, runtime performance and operational clarity.',
      skills: [
        'Distributed systems',
        'APIs',
        'Cloud',
        'Performance',
        'Observability',
      ],
    },
  ],
  dona: {
    label: 'Featured work',
    title: 'Dona Events',
    role: 'Creator & Principal Engineer',
    summary:
      'AI-powered event platform with mobile apps, digital invitations, real-time RSVP, event management and digital gifts.',
    metric:
      'More than 35,000 events created. Features include Dona AI image and content generation, guest management, notifications, and Pix and card payments.',
    cta: 'Explore Dona Events',
  },
  donaCase: {
    challengeTitle: 'The product challenge',
    challenge:
      'Bring invitations, RSVPs, notifications and digital gifts into one event experience across mobile and web.',
    backCta: 'Back to selected work',
    outcomeTitle: 'Product outcome',
    outcome:
      'Dona Events brings the event journey into one product, from creating an invitation to managing guests, RSVPs and digital gifts.',
    ownershipTitle: 'Approach and ownership',
    ownership:
      'Created and engineered the product end to end: mobile and web experiences, backend, infrastructure and AI, with image and content generation integrated into the event journey.',
    capabilitiesTitle: 'Product features',
    capabilities: [
      'Dona AI image and content generation',
      'Digital invitations',
      'Guest management and real-time RSVP',
      'Notifications',
      'Digital gifts with Pix and card payments',
    ],
    platformsTitle: 'Platforms',
    platforms: ['Mobile apps', 'Web experience'],
    metric: '35k+ events created',
    externalCta: 'Visit Dona Events',
  },
  career: {
    title: 'Career highlights',
    items: [
      {
        period: 'Current',
        company: 'IXC Soft',
        role: 'Principal AI System Architect',
        summary:
          'Leading architecture and engineering decisions for scalable digital products.',
      },
      {
        period: 'Previous',
        company: 'Midway',
        role: 'Software Engineer',
        summary:
          'Built reliable mobile experiences and financial products at production scale.',
      },
      {
        period: 'Previous',
        company: 'VAI Car',
        role: 'Software Engineer',
        summary:
          'Delivered mobile and backend features for a high-availability mobility platform.',
      },
      {
        period: 'Previous',
        company: 'Quero Bolsa',
        role: 'Software Engineer',
        summary:
          'Developed consumer-facing education products with a focus on performance and maintainability.',
      },
      {
        period: 'Previous',
        company: 'Claro',
        role: 'Technology Professional',
        summary:
          'Built a foundation in infrastructure that shaped my work across systems and products.',
      },
    ],
  },
  contact: {
    linkedinCta: 'Let’s talk on LinkedIn',
    title: 'Open channel',
    summary:
      'Let’s discuss AI systems, software architecture and mobile products, from technical direction to production.',
  },
} satisfies PortfolioContent;
