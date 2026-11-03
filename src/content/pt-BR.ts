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
    disciplines:
      'Sistemas de IA · Arquitetura de Software · Aplicativos móveis',
    summary:
      'Projeto sistemas de IA e levo produtos inteligentes à produção, conectando arquitetura de software, experiências em aplicativos móveis e engenharia de ponta a ponta.',
    workCta: 'Ver trabalhos',
    linkedinCta: 'Conectar no LinkedIn',
    resumeCta: 'Baixar currículo',
    capabilities: [
      { id: 'distributed', label: 'Sistemas distribuídos' },
      { id: 'mobile', label: 'Aplicativos móveis' },
      { id: 'ai', label: 'IA aplicada' },
      { id: 'observability', label: 'Observabilidade' },
    ],
  },
  expertise: [
    {
      id: 'ai',
      title: 'Inteligência Artificial',
      description:
        'Produtos com IA, experiências generativas e fluxos de trabalho inteligentes projetados para produção.',
      skills: [
        'Produtos com IA',
        'Experiências generativas',
        'Fluxos de trabalho inteligentes',
      ],
    },
    {
      id: 'mobile',
      title: 'Engenharia de aplicativos móveis',
      description:
        'Aplicativos em produção com experiências de qualidade nativa para iOS e Android.',
      skills: ['React Native', 'Swift', 'iOS', 'Android'],
    },
    {
      id: 'architecture',
      title: 'Arquitetura de Software',
      description:
        'Plataformas resilientes que equilibram velocidade de entrega, desempenho e clareza operacional.',
      skills: [
        'Sistemas distribuídos',
        'APIs',
        'Nuvem',
        'Desempenho',
        'Observabilidade',
      ],
    },
  ],
  dona: {
    label: 'Trabalho em destaque',
    title: 'Dona Events',
    role: 'Criador e engenheiro principal',
    summary:
      'Plataforma de eventos com IA, aplicativos móveis, convites digitais, confirmação de presença em tempo real, gestão de eventos e presentes digitais.',
    metric:
      'Mais de 35 mil eventos criados. Os recursos incluem geração de imagens e conteúdo pela Dona IA, gestão de convidados, notificações e pagamentos via Pix e cartão.',
    cta: 'Explorar Dona Events',
  },
  donaCase: {
    challengeTitle: 'O desafio do produto',
    challenge:
      'Reunir convites, confirmações de presença, notificações e presentes digitais em uma experiência de eventos em aplicativos móveis e na web.',
    backCta: 'Voltar aos trabalhos selecionados',
    outcomeTitle: 'Resultado do produto',
    outcome:
      'Dona Events reúne a jornada do evento em um único produto, da criação do convite à gestão de convidados, confirmações de presença e presentes digitais.',
    ownershipTitle: 'Abordagem e responsabilidade',
    ownership:
      'Criação e desenvolvimento do produto de ponta a ponta: aplicativos móveis, experiência web, backend, infraestrutura e IA, com geração de imagens e conteúdo integrada à jornada do evento.',
    capabilitiesTitle: 'Funcionalidades do produto',
    capabilities: [
      'Geração de imagens e conteúdo com Dona IA',
      'Convites digitais',
      'Gestão de convidados e confirmação de presença em tempo real',
      'Notificações',
      'Presentes digitais com pagamentos via Pix e cartão',
    ],
    platformsTitle: 'Plataformas',
    platforms: ['Aplicativos móveis', 'Experiência web'],
    metric: 'Mais de 35 mil eventos criados',
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
          'Liderança nas decisões de arquitetura e engenharia para produtos digitais escaláveis.',
      },
      {
        period: 'Anterior',
        company: 'Midway',
        role: 'Engenheiro de software',
        summary:
          'Desenvolvimento de experiências em aplicativos móveis e produtos financeiros confiáveis em escala de produção.',
      },
      {
        period: 'Anterior',
        company: 'VAI Car',
        role: 'Engenheiro de software',
        summary:
          'Desenvolvimento de funcionalidades em aplicativos móveis e no backend para uma plataforma de mobilidade de alta disponibilidade.',
      },
      {
        period: 'Anterior',
        company: 'Quero Bolsa',
        role: 'Engenheiro de software',
        summary:
          'Desenvolvimento de produtos de educação para consumidores com foco em desempenho e facilidade de manutenção.',
      },
      {
        period: 'Anterior',
        company: 'Claro',
        role: 'Profissional de tecnologia',
        summary:
          'Construção de uma base em infraestrutura que orientou meu trabalho com sistemas e produtos.',
      },
    ],
  },
  contact: {
    linkedinCta: 'Conversar no LinkedIn',
    title: 'Canal aberto',
    summary:
      'Vamos conversar sobre sistemas de IA, arquitetura de software e aplicativos móveis, da direção técnica à produção.',
  },
} satisfies PortfolioContent;
