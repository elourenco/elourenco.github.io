import type { PortfolioContent } from './schema';

export const ptBRContent = {
  locale: 'pt-BR',
  navigation: {
    expertise: 'Especialidades',
    work: 'Trabalhos selecionados',
    career: 'Carreira',
    contact: 'Contato',
  },
  hero: {
    eyebrow: 'Eduardo Lourenco',
    title: 'Principal AI System Architect',
    disciplines: 'Sistemas de IA · Arquitetura de Software · Mobile',
    summary:
      'Projeto sistemas de IA e levo produtos inteligentes à produção, conectando arquitetura de software, experiências mobile e engenharia de ponta a ponta.',
    workCta: 'Ver trabalhos',
    linkedinCta: 'Conectar no LinkedIn',
    resumeCta: 'Baixar currículo',
    capabilities: [
      { id: 'distributed', label: 'Sistemas distribuídos' },
      { id: 'mobile', label: 'Mobile' },
      { id: 'ai', label: 'IA aplicada' },
      { id: 'observability', label: 'Observabilidade' },
    ],
  },
  expertise: [
    {
      id: 'ai',
      title: 'Inteligência Artificial',
      description:
        'Produtos orientados por IA, experiências generativas e workflows inteligentes projetados para produção.',
      skills: [
        'Produtos com IA',
        'Experiências generativas',
        'Workflows inteligentes',
      ],
    },
    {
      id: 'mobile',
      title: 'Engenharia Mobile',
      description:
        'Aplicativos de produção com experiência de qualidade nativa para iOS e Android.',
      skills: ['React Native', 'Swift', 'iOS', 'Android'],
    },
    {
      id: 'architecture',
      title: 'Arquitetura de Software',
      description:
        'Plataformas resilientes que equilibram velocidade de entrega, performance e clareza operacional.',
      skills: [
        'Sistemas distribuídos',
        'APIs',
        'Cloud',
        'Performance',
        'Observabilidade',
      ],
    },
  ],
  dona: {
    label: 'Trabalho em destaque',
    title: 'Dona Events',
    role: 'Creator & Principal Engineer',
    summary:
      'Plataforma de eventos com IA, aplicativos mobile, convites digitais, RSVP em tempo real, gestão de eventos e presentes digitais.',
    metric:
      'Mais de 35 mil eventos criados, com geração de imagens e conteúdo pela Dona IA, gestão de convidados, notificações e pagamentos via Pix e cartão.',
    cta: 'Explorar Dona Events',
  },
  donaCase: {
    challengeTitle: 'O desafio do produto',
    challenge:
      'Reunir convites, confirmações de convidados, notificações e presentes digitais em uma experiência de eventos no mobile e na web.',
    backCta: 'Voltar aos trabalhos selecionados',
    outcomeTitle: 'Resultado do produto',
    outcome:
      'Dona Events reúne a jornada do evento em um único produto, da criação do convite à gestão de convidados, confirmações e presentes digitais.',
    ownershipTitle: 'Abordagem e responsabilidade',
    ownership:
      'Criação e desenvolvimento do produto de ponta a ponta: experiências mobile e web, backend, infraestrutura e IA, com geração de imagens e conteúdo integrada à jornada do evento.',
    capabilitiesTitle: 'Capacidades públicas',
    capabilities: [
      'Geração de imagens e conteúdo com Dona IA',
      'Convites digitais',
      'Gestão de convidados e RSVP em tempo real',
      'Notificações',
      'Presentes digitais com pagamentos via Pix e cartão',
    ],
    platformsTitle: 'Plataformas',
    platforms: ['Aplicativos mobile', 'Experiência web'],
    metric: '35 mil+ eventos criados',
    externalCta: 'Visitar Dona Events',
  },
  career: {
    title: 'Destaques da carreira',
    items: [
      {
        period: 'Atual',
        company: 'IXC Soft',
        role: 'Principal AI System Architect',
        summary:
          'Liderança de decisões de arquitetura e engenharia para produtos digitais escaláveis.',
      },
      {
        period: 'Anterior',
        company: 'Midway',
        role: 'Software Engineer',
        summary:
          'Construção de experiências mobile e financeiras confiáveis em escala de produção.',
      },
      {
        period: 'Anterior',
        company: 'VAI Car',
        role: 'Software Engineer',
        summary:
          'Entrega de capacidades mobile e backend para uma plataforma de mobilidade de alta disponibilidade.',
      },
      {
        period: 'Anterior',
        company: 'Quero Bolsa',
        role: 'Software Engineer',
        summary:
          'Evolução de produtos de educação para consumidores com foco em performance e manutenção.',
      },
      {
        period: 'Anterior',
        company: 'Claro',
        role: 'Profissional de Tecnologia',
        summary:
          'Desenvolvimento da base de infraestrutura que formou uma carreira entre sistemas e produtos.',
      },
    ],
  },
  contact: {
    linkedinCta: 'Conversar no LinkedIn',
    title: 'Canal aberto',
    summary:
      'Vamos conversar sobre sistemas de IA, arquitetura de software e produtos mobile, da direção técnica à produção.',
  },
} satisfies PortfolioContent;
