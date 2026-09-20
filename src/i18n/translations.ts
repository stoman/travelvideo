import type { Locale } from './locale.ts';

export interface UiStrings {
  nav: {
    videos: string;
    random: string;
    map: string;
    trips: string;
    about: string;
    /** Flag + own-name of the *other* locale, shown as the 6th nav stamp. */
    switchTo: string;
  };
  trips: {
    heading: string;
    watchTrip: (tripName: string) => string;
  };
  tripOverview: {
    watchAll: string;
    dayGap: (n: number) => string;
  };
  countryOverview: {
    videoCount: (n: number) => string;
  };
  videos: {
    heading: (videoCount: number, countryCount: number) => string;
  };
  videoInfo: {
    country: string;
    date: string;
    guests: string;
    camera: string;
    partOfTrips: string;
    startFullTrip: string;
    startAt: (videoName: string) => string;
    tripLine: (tripName: string, year: string) => string;
  };
  playback: {
    previousVideo: string;
    nextVideo: string;
    stopAtThisVideo: string;
  };
  map: {
    heading: string;
    instructions: string;
  };
  notFound: {
    heading: string;
    /** `tripsHref`/`videosHref` are already-built, locale-prefixed hrefs. */
    body: (tripsHref: string, videosHref: string) => string;
  };
  about: {
    heading: string;
    imageAlt: string;
    intro: string;
    /** `tripsHref`/`mapHref`/`randomHref` are already-built, locale-prefixed hrefs. */
    explore: (tripsHref: string, mapHref: string, randomHref: string) => string;
    /** `repoHref` is the (locale-independent) GitHub URL. */
    github: (repoHref: string) => string;
    seeYou: string;
  };
}

export const translations: Record<Locale, UiStrings> = {
  en: {
    nav: {
      videos: 'Videos',
      random: 'Random',
      map: 'Map',
      trips: 'Trips',
      about: 'About',
      switchTo: '🇩🇪 Deutsch',
    },
    trips: {
      heading: 'Trips',
      watchTrip: (tripName) => `Watch ${tripName}`,
    },
    tripOverview: {
      watchAll: 'Watch all the videos of this trip',
      dayGap: (n) => `${n} day${n === 1 ? '' : 's'} without video`,
    },
    countryOverview: {
      videoCount: (n) => `${n} video${n === 1 ? '' : 's'}`,
    },
    videos: {
      heading: (videoCount, countryCount) =>
        `${videoCount} Videos from ${countryCount} Countries`,
    },
    videoInfo: {
      country: 'Country',
      date: 'Date',
      guests: 'Guests',
      camera: 'Camera',
      partOfTrips: 'This video is part of the trips:',
      startFullTrip: 'start full trip',
      startAt: (videoName) => `start at ${videoName}`,
      tripLine: (tripName, year) => `${tripName} ${year}`,
    },
    playback: {
      previousVideo: 'Previous video',
      nextVideo: 'Next video',
      stopAtThisVideo: 'Stop at this video',
    },
    map: {
      heading: 'Map',
      instructions: 'Drag to move around, scroll or pinch to zoom.',
    },
    notFound: {
      heading: 'Not found',
      body: (tripsHref, videosHref) =>
        `There's nothing here. Try the <a href="${tripsHref}">list of trips</a> or the <a href="${videosHref}">list of videos</a>.`,
    },
    about: {
      heading: 'Welcome to our Travel Map',
      imageAlt: 'Anna and Stefan',
      intro: `We are Anna and Stefan. At this website we keep a log of some of the places we
      visited together. In most of those places we created a short video holding a sign with
      the name of the city. The videos are concatenated in a way such that each video starts
      with the same people visible as the last one ended with.`,
      explore: (tripsHref, mapHref, randomHref) =>
        `Explore the <a href="${tripsHref}">list of our trips</a>, check the
      <a href="${mapHref}">map of locations we visited</a>, or just watch some
      <a href="${randomHref}">videos in random order</a>.`,
      github: (repoHref) =>
        `If you are interested in the technical details of this website, check our
      <a href="${repoHref}" target="_blank" rel="noopener noreferrer">public GitHub repository</a>.
      Stars, comments, or even contributions to the code are always welcome.`,
      seeYou: 'See you on the road!',
    },
  },
  de: {
    nav: {
      videos: 'Videos',
      random: 'Zufall',
      map: 'Karte',
      trips: 'Reisen',
      about: 'Über uns',
      switchTo: '🇬🇧 English',
    },
    trips: {
      heading: 'Reisen',
      watchTrip: (tripName) => `${tripName} ansehen`,
    },
    tripOverview: {
      watchAll: 'Alle Videos dieser Reise ansehen',
      dayGap: (n) => `${n} Tag${n === 1 ? '' : 'e'} ohne Video`,
    },
    countryOverview: {
      videoCount: (n) => `${n} Video${n === 1 ? '' : 's'}`,
    },
    videos: {
      heading: (videoCount, countryCount) =>
        `${videoCount} Videos aus ${countryCount} Ländern`,
    },
    videoInfo: {
      country: 'Land',
      date: 'Datum',
      guests: 'Gäste',
      camera: 'Kamera',
      partOfTrips: 'Dieses Video ist Teil folgender Reisen:',
      startFullTrip: 'ganze Reise starten',
      startAt: (videoName) => `bei ${videoName} starten`,
      tripLine: (tripName, year) => `${tripName} ${year}`,
    },
    playback: {
      previousVideo: 'Vorheriges Video',
      nextVideo: 'Nächstes Video',
      stopAtThisVideo: 'Bei diesem Video anhalten',
    },
    map: {
      heading: 'Karte',
      instructions:
        'Zum Bewegen ziehen, zum Zoomen scrollen oder mit zwei Fingern zoomen.',
    },
    notFound: {
      heading: 'Nicht gefunden',
      body: (tripsHref, videosHref) =>
        `Hier gibt es nichts zu sehen. Versuche die <a href="${tripsHref}">Liste unserer Reisen</a> oder die <a href="${videosHref}">Liste der Videos</a>.`,
    },
    about: {
      heading: 'Willkommen auf unserer Reise-Karte',
      imageAlt: 'Anna und Stefan',
      intro: `Wir sind Anna und Stefan. Auf dieser Website halten wir fest, an welchen Orten wir
      gemeinsam waren. An den meisten dieser Orte haben wir ein kurzes Video gedreht, in dem wir
      ein Schild mit dem Namen des Ortes halten. Die Videos sind so aneinandergeschnitten, dass
      jedes Video mit denselben Personen beginnt, mit denen das vorherige geendet hat.`,
      explore: (tripsHref, mapHref, randomHref) =>
        `Entdecke die <a href="${tripsHref}">Liste unserer Reisen</a>, wirf einen Blick auf die
      <a href="${mapHref}">Karte der von uns besuchten Orte</a>, oder schau dir einfach ein paar
      <a href="${randomHref}">Videos in zufälliger Reihenfolge</a> an.`,
      github: (repoHref) =>
        `Wenn dich die technischen Details dieser Website interessieren, wirf einen Blick in
      unser <a href="${repoHref}" target="_blank" rel="noopener noreferrer">öffentliches GitHub-Repository</a>.
      Sterne, Kommentare oder sogar Beiträge zum Code sind immer willkommen.`,
      seeYou: 'Bis zum nächsten Mal unterwegs!',
    },
  },
};
