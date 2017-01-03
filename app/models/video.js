import DS from 'ember-data';

var Video = DS.Model.extend({
  //attributes
  name: DS.attr('string'),
  description: DS.attr('string'),
  country: DS.attr('string'),
  path: DS.attr('string'),
  date: DS.attr('date'),
  latitude: DS.attr('number'),
  longitude: DS.attr('number'),
  peopleIn: DS.attr('string'),
  peopleOut: DS.attr('string'),
  guests: DS.attr('string'),
  camera: DS.attr('string')
});

//fixtures: add more data here
Video.reopenClass({
  FIXTURES: [
    {
      id: 'abisko',
      name: 'Abisko',
      description: 'This is a description.',
      country: 'Sweden',
      path: 'abisko.mp4',
      date: '2013-01-01',
      latitude: 68.357879,
      longitude: 18.778065,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: '',
      peopleEnd: '',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'dubai',
      name: 'Dubai',
      description: '',
      country: 'United Arab Emirates',
      path: 'dubai.mp4',
      date: '2014-08-31',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'peking.mp4',
      date: '2014-09-02',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'peking2',
      name: 'Peking',
      description: '',
      country: 'China',
      path: 'peking2.mp4',
      date: '2014-09-03',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'zhangjiajie',
      name: 'Zhangjiajie',
      description: 'Tianmen Mountain',
      country: 'China',
      path: 'zhangjiajie.mp4',
      date: '2014-09-06',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      peopleStart: 'Anna',
      peopleEnd: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'zhangjiajie_nationalpark',
      name: 'Zhangjiajie',
      description: 'National Park',
      country: 'China',
      path: 'zhangjiajie_nationalpark.mp4',
      date: '2014-09-07',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'guilin.mp4',
      date: '2014-09-09',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'tiantouzhai.mp4',
      date: '2014-09-11',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'tiantouzhai2.mp4',
      date: '2014-09-11',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'yangshuo.mp4',
      date: '2014-09-12',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'xingping.mp4',
      date: '2014-09-14',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'lijiang.mp4',
      date: '2014-09-15',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'tiger_leaping_gorge.mp4',
      date: '2014-09-16',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Anna-Maria, Stefan',
      peopleStart: 'Anna-Maria, Stefan',
      peopleEnd: 'Anna',
      guests: 'two Australian girls',
      camera: 'Sony Cybershot'
    },
    {
      id: 'hongkong',
      name: 'Hongkong',
      description: '',
      country: 'China',
      path: 'hongkong.mp4',
      date: '2014-09-19',
      latitude: 0.0,
      longitude: 0.0,
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
      path: 'taormina.mp4',
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
      path: 'siracusa.mp4',
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
      path: 'etna.mp4',
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
      path: 'funchal.mp4',
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
      path: 'famara.mp4',
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
      path: 'puerto_del_rosario.mp4',
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
      path: 'santa_cruz.mp4',
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
      path: 'las_palmas.mp4',
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
      path: 'reykjavik.mp4',
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
      path: 'gullfoss.mp4',
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
      path: 'landmannahellir.mp4',
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
      path: 'kirkjubaejarklaustur.mp4',
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
      path: 'joekulsarlon.mp4',
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
      path: 'seydisfjoerdur.mp4',
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
      path: 'asbyrgi.mp4',
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
      path: 'hverfjall.mp4',
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
      path: 'drangsnes.mp4',
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
      path: 'porskafjoerdur.mp4',
      date: '2016-09-09',
      latitude: 65.569590,
      longitude: -22.188903,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      peopleStart: 'Stefan',
      peopleEnd: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    }
  ]
});

export default Video;
