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
    title: 'Principal Software Engineer',
    disciplines: 'AI · Mobile · Software Architecture',
    summary:
      'I design and build intelligent digital products, from system architecture to production.',
    workCta: 'View selected work',
    linkedinCta: 'Connect on LinkedIn',
    resumeCta: 'Download résumé',
  },
  expertise: [
    {
      id: 'ai',
      title: 'Artificial Intelligence',
      description:
        'AI-oriented products, generative experiences and intelligent workflows designed for production.',
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
      'More than 35,000 events created, with Dona AI image and content generation, guest management, notifications, Pix and card payments.',
    cta: 'Explore Dona Events',
  },
  career: {
    title: 'Career highlights',
    items: [
      {
        period: 'Current',
        company: 'IXC Soft',
        role: 'Principal Software Engineer',
        summary:
          'Leading architecture and engineering decisions for scalable digital products.',
      },
      {
        period: 'Previous',
        company: 'Midway',
        role: 'Software Engineer',
        summary:
          'Built reliable mobile and financial product experiences for production scale.',
      },
      {
        period: 'Previous',
        company: 'VAI Car',
        role: 'Software Engineer',
        summary:
          'Delivered mobile and backend capabilities for a high-availability mobility platform.',
      },
      {
        period: 'Previous',
        company: 'Quero Bolsa',
        role: 'Software Engineer',
        summary:
          'Evolved consumer-facing education products with performance and maintainability in focus.',
      },
      {
        period: 'Previous',
        company: 'Claro',
        role: 'Technology Professional',
        summary:
          'Developed the infrastructure foundation that shaped a career across systems and products.',
      },
    ],
  },
  contact: {
    title: 'Open channel',
    summary:
      'Let’s connect to discuss software architecture, intelligent products and engineering leadership.',
  },
} satisfies PortfolioContent;
