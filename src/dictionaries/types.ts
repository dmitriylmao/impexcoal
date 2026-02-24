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
