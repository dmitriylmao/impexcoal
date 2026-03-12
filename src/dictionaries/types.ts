export type SiteDictionary = {
  header: {
    title: string;
    subtitle: string;
  };
  news: {
    title: string;
    empty: string;
    category: string;
    date: string;
  };
  switcher: {
    label: string;
  };
  ui: {
    header: {
      nav: {
        home: string;
        about: string;
        segments: string;
        products: string;
        news: string;
        contacts: string;
      };
      contactButton: string;
    };
    homeHero: {
      title: string;
      subtitle: string;
      cta: string;
      scrollLabel: string;
    };
    homeWhyChoose: {
      badge: string;
      title: string;
      cards: Array<{
        title: string;
        subtitle: string;
        description: string;
      }>;
    };
    homeDifferences: {
      badge: string;
      title: string;
      leadAccent: string;
      leadRest: string;
      body: string;
    };
    homeDeck: {
      badge: string;
      cards: Array<{
        title: string;
        description: string;
        metricValue: string;
        metricLabel: string;
        imageAlt: string;
      }>;
    };
    homeSegments: {
      badge: string;
      title: string;
      cta: string;
      tabs: Array<{
        tab: string;
        title: string;
        description: string;
      }>;
    };
    homeCycle: {
      badge: string;
      title: string;
      imageAlt: string;
    };
    homeProducts: {
      badge: string;
      title: string;
      subtitle: string;
      showAll: string;
      showLess: string;
      modalClose: string;
    };
    homeDocuments: {
      badge: string;
    };
    homeFaq: {
      badge: string;
      title: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
      cardTitle: string;
      cardSubtitle: string;
      cardButton: string;
    };
    homeContact: {
      badge: string;
      title: string;
      cta: string;
    };
    contactsPage: {
      emailTitle: string;
      emailSubtitle: string;
      emailLink: string;
      managerTitle: string;
      managerSubtitle: string;
      managerLink: string;
      addressTitle: string;
      addressText: string;
      mapLink: string;
      feedbackTitle: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      commentLabel: string;
      commentPlaceholder: string;
      submit: string;
      submitSending: string;
      errorRequired: string;
      errorServiceUnavailable: string;
      errorSendFailed: string;
      errorNetwork: string;
    };
    thanksPage: {
      title: string;
      subtitle: string;
      homeButton: string;
    };
    notFound: {
      codeLabel: string;
      title: string;
      homeButton: string;
    };
    footer: {
      links: {
        home: string;
        company: string;
        contacts: string;
        news: string;
        privacy: string;
      };
      copyright: string;
      email: string;
    };
    newsList: {
      badge: string;
      title: string;
      subtitle: string;
      cardSubtitle: string;
      loadMore: string;
    };
    newsArticle: {
      back: string;
      subtitle: string;
    };
  };
};
