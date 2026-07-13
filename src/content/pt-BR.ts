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
    title: 'Principal Software Engineer',
    disciplines: 'IA · Mobile · Arquitetura de Software',
    summary:
      'Projeto e construo produtos digitais inteligentes, da arquitetura de sistemas até a produção.',
    workCta: 'Ver trabalhos',
    linkedinCta: 'Conectar no LinkedIn',
    resumeCta: 'Baixar currículo',
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
    role: 'Criador & Principal Engineer',
    summary:
      'Plataforma de eventos com IA, aplicativos mobile, convites digitais, RSVP em tempo real, gestão de eventos e presentes digitais.',
    metric:
      'Mais de 35 mil eventos criados, com geração de imagens e conteúdo pela Dona IA, gestão de convidados, notificações e pagamentos via Pix e cartão.',
    cta: 'Explorar Dona Events',
  },
  career: {
    title: 'Destaques da carreira',
    items: [
      {
        period: 'Atual',
        company: 'IXC Soft',
        role: 'Principal Software Engineer',
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
    title: 'Canal aberto',
    summary:
      'Vamos conversar sobre arquitetura de software, produtos inteligentes e liderança de engenharia.',
  },
} satisfies PortfolioContent;
