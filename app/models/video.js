import DS from 'ember-data';

var Video = DS.Model.extend({
  //attributes
  name: DS.attr('string'),
  description: DS.attr('string'),
  country: DS.attr('string'),
  filename: DS.attr('string'),
  date: DS.attr('date'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  peopleIn: DS.attr('string'),
  peopleOut: DS.attr('string'),
  peopleStart: DS.attr('string'),
  peopleEnd: DS.attr('string'),
  guests: DS.attr('string'),
  camera: DS.attr('string'),
  trips: DS.hasMany('trip')
});

//fixtures: add more data here
Video.reopenClass({
  FIXTURES: [
    {
      id: 'munich_airport',
      name: 'München Flughafen',
      description: '',
      country: 'Germany',
      filename: 'munich_airport.mp4',
      date: '2013-08-15',
      latitude: 48.352944,
      longitude: 11.798017,
      peopleIn: 'Stefan',
      peopleOut: 'Stefan',
      peopleStart: 'Anna',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'stockholm_arlanda',
      name: 'Stockholm Arlanda',
      description: '',
      country: 'Sweden',
      filename: 'stockholm_arlanda.mp4',
      date: '2013-08-16',
      latitude: 59.639942,
      longitude: 17.938915,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'abisko',
      name: 'Abisko',
      description: '',
      country: 'Sweden',
      filename: 'abisko.mp4',
      date: '2013-08-19',
      latitude: 68.357879,
      longitude: 18.778065,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'narvik',
      name: 'Narvik',
      description: '',
      country: 'Norway',
      filename: 'narvik.mp4',
      date: '2013-08-21',
      latitude: 68.439057,
      longitude: 17.412454,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'lulea',
      name: 'Luleå',
      description: '',
      country: 'Sweden',
      filename: 'lulea.mp4',
      date: '2013-08-22',
      latitude: 65.580458,
      longitude: 22.153675,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'kemi',
      name: 'Kemi',
      description: '',
      country: 'Finland',
      filename: 'kemi.mp4',
      date: '2013-08-23',
      latitude: 65.734758,
      longitude: 24.549614,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'oulu',
      name: 'Oulu',
      description: '',
      country: 'Finland',
      filename: 'oulu.mp4',
      date: '2013-08-24',
      latitude: 65.013199,
      longitude: 25.462310,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'helsinki',
      name: 'Helsinki',
      description: 'Suomenlinna',
      country: 'Finland',
      filename: 'helsinki.mp4',
      date: '2013-08-25',
      latitude: 60.138269,
      longitude: 24.988375,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'stockholm',
      name: 'Stockholm',
      description: '',
      country: 'Sweden',
      filename: 'stockholm.mp4',
      date: '2013-08-28',
      latitude: 59.328133,
      longitude: 18.070212,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'skopje',
      name: 'Skopje',
      description: '',
      country: 'Macedonia',
      filename: 'skopje.mp4',
      date: '2013-08-31',
      latitude: 41.998718,
      longitude: 21.435798,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'sofia',
      name: 'Sofia',
      description: '',
      country: 'Bulgaria',
      filename: 'sofia.mp4',
      date: '2013-09-03',
      latitude: 42.695203,
      longitude: 23.333215,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'belgrad',
      name: 'Belgrad',
      description: '',
      country: 'Serbia',
      filename: 'belgrad.mp4',
      date: '2013-09-04',
      latitude: 44.825249,
      longitude: 20.450516,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'bar',
      name: 'Bar',
      description: '',
      country: 'Montenegro',
      filename: 'bar.mp4',
      date: '2013-09-08',
      latitude: 42.100747,
      longitude: 19.090676,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'dubrovnik',
      name: 'Dubrovnik',
      description: '',
      country: 'Croatia',
      filename: 'dubrovnik.mp4',
      date: '2013-09-09',
      latitude: 42.641187,
      longitude: 18.104288,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'mostar',
      name: 'Mostar',
      description: '',
      country: 'Bosnia and Herzegovina',
      filename: 'mostar.mp4',
      date: '2013-09-10',
      latitude: 43.336995,
      longitude: 17.814925,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'split',
      name: 'Split',
      description: '',
      country: 'Croatia',
      filename: 'split.mp4',
      date: '2013-09-12',
      latitude: 43.509298,
      longitude: 16.440703,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'zagreb',
      name: 'Zagreb',
      description: '',
      country: 'Croatia',
      filename: 'zagreb.mp4',
      date: '2013-09-13',
      latitude: 45.805092,
      longitude: 15.988084,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'ljubljana',
      name: 'Ljubljana',
      description: '',
      country: 'Slovenia',
      filename: 'ljubljana.mp4',
      date: '2013-09-14',
      latitude: 46.048286,
      longitude: 14.508855,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'salzburg',
      name: 'Salzburg',
      description: '',
      country: 'Austria',
      filename: 'salzburg.mp4',
      date: '2013-09-15',
      latitude: 47.798891,
      longitude: 13.047564,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'dahoam',
      name: 'Dahoam',
      description: '',
      country: 'Germany',
      filename: 'dahoam.mp4',
      date: '2013-09-15',
      latitude: 48.144391,
      longitude: 11.500945,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'dubai',
      name: 'Dubai',
      description: '',
      country: 'United Arab Emirates',
      filename: 'dubai.mp4',
      date: '2014-08-31',
      latitude: 25.082760,
      longitude: 55.148307,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'peking',
      name: 'Peking',
      description: '',
      country: 'China',
      filename: 'peking.mp4',
      date: '2014-09-02',
      latitude: 39.909026,
      longitude: 116.386989,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'peking_olympic_park',
      name: 'Peking Olympic Park',
      description: '',
      country: 'China',
      filename: 'peking_olympic_park.mp4',
      date: '2014-09-03',
      latitude: 39.989895,
      longitude: 116.388829,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'zhangjiajie_tianmen_mountain',
      name: 'Zhangjiajie Tianmen Mountain',
      description: '',
      country: 'China',
      filename: 'zhangjiajie_tianmen_mountain.mp4',
      date: '2014-09-06',
      latitude: 29.049495,
      longitude: 110.472074,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'zhangjiajie_nationalpark',
      name: 'Zhangjiajie National Park',
      description: '',
      country: 'China',
      filename: 'zhangjiajie_nationalpark.mp4',
      date: '2014-09-07',
      latitude: 29.344573,
      longitude: 110.443344,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'guilin',
      name: 'Guilin',
      description: '',
      country: 'China',
      filename: 'guilin.mp4',
      date: '2014-09-09',
      latitude: 25.271478,
      longitude: 110.294599,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'tiantouzhai',
      name: 'Tiantouzhai',
      description: '',
      country: 'China',
      filename: 'tiantouzhai.mp4',
      date: '2014-09-11',
      latitude: 25.816609,
      longitude: 110.142624,
      peopleIn: 'Anna, Anna-Maria, Jasmin',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna, Anna-Maria, Jasmin',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'tiantouzhai2',
      name: 'Tiantouzhai',
      description: '',
      country: 'China',
      filename: 'tiantouzhai2.mp4',
      date: '2014-09-11',
      latitude: 25.817320,
      longitude: 110.149968,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'yangshuo',
      name: 'Yangshuo',
      description: '',
      country: 'China',
      filename: 'yangshuo.mp4',
      date: '2014-09-12',
      latitude: 24.776696,
      longitude: 110.491327,
      peopleIn: 'Stefan',
      peopleOut: 'Anna, Anna-Maria',
      peopleStart: 'Anna, Anna-Maria, Jasmin',
      peopleEnd: 'Jasmin, Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'xingping',
      name: 'Xingping',
      description: '',
      country: 'China',
      filename: 'xingping.mp4',
      date: '2014-09-14',
      latitude: 24.922962,
      longitude: 110.519638,
      peopleIn: 'Anna, Anna-Maria',
      peopleOut: 'Jasmin, Stefan',
      peopleStart: 'Jasmin, Stefan',
      peopleEnd: 'Anna, Anna-Maria',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'lijiang',
      name: 'Lijiang',
      description: '',
      country: 'China',
      filename: 'lijiang.mp4',
      date: '2014-09-15',
      latitude: 26.870057,
      longitude: 100.234191,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna, Anna-Maria',
      peopleEnd: 'Anna-Maria, Stefan',
      guests: 'Chinese girl',
      camera: 'Sony Cybershot'
    },
    {
      id: 'tiger_leaping_gorge',
      name: 'Tiger Leaping Gorge',
      description: '',
      country: 'China',
      filename: 'tiger_leaping_gorge.mp4',
      date: '2014-09-16',
      latitude: 27.212013,
      longitude: 100.120471,
      peopleIn: 'Anna',
      peopleOut: 'Anna-Maria, Stefan',
      peopleStart: 'Anna-Maria, Stefan',
      peopleEnd: 'Anna',
      guests: 'Fiona, C.',
      camera: 'Sony Cybershot'
    },
    {
      id: 'hongkong',
      name: 'Hongkong',
      description: '',
      country: 'China',
      filename: 'hongkong.mp4',
      date: '2014-09-19',
      latitude: 22.277622,
      longitude: 114.147364,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'taormina',
      name: 'Taormina',
      description: 'Sicily',
      country: 'Italy',
      filename: 'taormina.mp4',
      date: '2015-07-26',
      latitude: 37.852538,
      longitude: 15.292472,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'siracusa',
      name: 'Siracusa',
      description: 'Sicily',
      country: 'Italy',
      filename: 'siracusa.mp4',
      date: '2015-07-30',
      latitude: 37.064065,
      longitude: 15.296454,
      peopleIn: 'Noemi, Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Noemi, Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'etna',
      name: 'Etna',
      description: 'Sicily',
      country: 'Italy',
      filename: 'etna.mp4',
      date: '2015-07-31',
      latitude: 37.704761,
      longitude: 15.005756,
      peopleIn: 'Stefan',
      peopleOut: 'Noemi, Anna',
      peopleStart: 'Noemi, Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'funchal',
      name: 'Funchal',
      description: 'Madeira',
      country: 'Portugal',
      filename: 'funchal.mp4',
      date: '2016-02-15',
      latitude: 32.675079,
      longitude: -16.901760,
      peopleIn: 'Bine, Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Bine, Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'famara',
      name: 'Famara',
      description: 'Lanzarote',
      country: 'Spain',
      filename: 'famara.mp4',
      date: '2016-02-17',
      latitude: 29.126193,
      longitude: -13.530870,
      peopleIn: 'Stefan',
      peopleOut: 'Bine, Anna',
      peopleStart: 'Bine, Anna',
      peopleEnd: 'Stefan',
      guests: 'Uwe',
      camera: 'Sony Cybershot'
    },
    {
      id: 'puerto_del_rosario',
      name: 'Puerto del Rosario',
      description: 'Fuerteventura',
      country: 'Spain',
      filename: 'puerto_del_rosario.mp4',
      date: '2016-02-18',
      latitude: 28.494432,
      longitude: -13.855715,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'santa_cruz',
      name: 'Santa Cruz',
      description: 'Tenerife',
      country: 'Spain',
      filename: 'santa_cruz.mp4',
      date: '2016-02-19',
      latitude: 28.453232,
      longitude: -16.254649,
      peopleIn: 'Bine, Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Bine, Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'las_palmas',
      name: 'Las Palmas',
      description: 'Gran Canaria',
      country: 'Spain',
      filename: 'las_palmas.mp4',
      date: '2016-02-20',
      latitude: 28.141019,
      longitude: -15.424760,
      peopleIn: 'Anna',
      peopleOut: 'Bine, Stefan',
      peopleStart: 'Bine, Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'reykjavik',
      name: 'Reykjavík',
      description: '',
      country: 'Iceland',
      filename: 'reykjavik.mp4',
      date: '2016-08-26',
      latitude: 64.142125,
      longitude: -21.928583,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'gullfoss',
      name: 'Gullfoss',
      description: '',
      country: 'Iceland',
      filename: 'gullfoss.mp4',
      date: '2016-08-28',
      latitude: 64.325054,
      longitude: -20.124635,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'landmannahellir',
      name: 'Landmannahellir',
      description: '',
      country: 'Iceland',
      filename: 'landmannahellir.mp4',
      date: '2016-08-29',
      latitude: 64.052209,
      longitude: -19.229349,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'kirkjubaejarklaustur',
      name: 'Kirkjubæjarklaustur',
      description: '',
      country: 'Iceland',
      filename: 'kirkjubaejarklaustur.mp4',
      date: '2016-08-30',
      latitude: 63.800035,
      longitude: -18.060763,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'joekulsarlon',
      name: 'Jökulsárlón',
      description: '',
      country: 'Iceland',
      filename: 'joekulsarlon.mp4',
      date: '2016-08-30',
      latitude: 64.048933,
      longitude: -16.180665,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'seydisfjoerdur',
      name: 'Seyðisfjörður',
      description: '',
      country: 'Iceland',
      filename: 'seydisfjoerdur.mp4',
      date: '2016-09-01',
      latitude: 65.230884,
      longitude: -14.079698,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'asbyrgi',
      name: 'Ásbyrgi',
      description: '',
      country: 'Iceland',
      filename: 'asbyrgi.mp4',
      date: '2016-09-02',
      latitude: 65.999704,
      longitude: -16.515904,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'hverfjall',
      name: 'Hverfjall',
      description: '',
      country: 'Iceland',
      filename: 'hverfjall.mp4',
      date: '2016-09-04',
      latitude: 65.605551,
      longitude: -16.863423,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'drangsnes',
      name: 'Drangsnes',
      description: '',
      country: 'Iceland',
      filename: 'drangsnes.mp4',
      date: '2016-09-07',
      latitude: 65.690533,
      longitude: -21.438313,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'porskafjoerdur',
      name: 'Porskafjörður',
      description: '',
      country: 'Iceland',
      filename: 'porskafjoerdur.mp4',
      date: '2016-09-09',
      latitude: 65.569590,
      longitude: -22.188903,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'dania_beach',
      name: 'Dania Beach',
      description: '',
      country: 'United States of America',
      filename: 'dania_beach.mp4',
      date: '2017-05-13',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'miami',
      name: 'Miami',
      description: '',
      country: 'United States of America',
      filename: 'miami.mp4',
      date: '2017-05-15',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'miami_beach',
      name: 'Miami Beach',
      description: '',
      country: 'United States of America',
      filename: 'miami_beach.mp4',
      date: '2017-05-14',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'quito',
      name: 'Quito',
      description: '',
      country: 'Ecuador',
      filename: 'quito.mp4',
      date: '2017-05-19',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'mitad_del_mundo',
      name: 'Mitad del Mundo',
      description: '',
      country: 'Ecuador',
      filename: 'mitad_del_mundo.mp4',
      date: '2017-05-23',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'cuyabeno',
      name: 'Cuyabeno',
      description: '',
      country: 'Ecuador',
      filename: 'cuyabeno.mp4',
      date: '2017-05-28',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: 'Claudia',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'tortuga_bay',
      name: 'Tortuga Bay',
      description: '',
      country: 'Ecuador',
      filename: 'tortuga_bay.mp4',
      date: '2017-06-02',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'genovesa',
      name: 'Genovesa',
      description: '',
      country: 'Ecuador',
      filename: 'genovesa.mp4',
      date: '2017-06-05',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'bartolome',
      name: 'Bartolomé',
      description: '',
      country: 'Ecuador',
      filename: 'bartolome.mp4',
      date: '2017-06-06',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'floreana',
      name: 'Floreana',
      description: '',
      country: 'Ecuador',
      filename: 'floreana.mp4',
      date: '2017-06-09',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'espanola',
      name: 'Española',
      description: '',
      country: 'Ecuador',
      filename: 'espanola.mp4',
      date: '2017-06-10',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    }
  ]
});

export default Video;
