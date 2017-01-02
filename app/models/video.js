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
      path: '/assets/videos/abisko.mp4',
      date: '2013-01-01',
      latitude: 68.357879,
      longitude: 18.778065,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'taormina',
      name: 'Taormina',
      description: 'Sicily',
      country: 'Italy',
      path: '/assets/videos/taormina.mp4',
      date: '2015-07-26',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'siracusa',
      name: 'Siracusa',
      description: 'Sicily',
      country: 'Italy',
      path: '/assets/videos/siracusa.mp4',
      date: '2015-07-30',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Noemi, Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'etna',
      name: 'Etna',
      description: 'Sicily',
      country: 'Italy',
      path: '/assets/videos/etna.mp4',
      date: '2015-07-31',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Noemi, Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'funchal',
      name: 'Funchal',
      description: 'Madeira',
      country: 'Portugal',
      path: '/assets/videos/funchal.mp4',
      date: '2016-02-15',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Bine, Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'famara',
      name: 'Famara',
      description: 'Lanzarote',
      country: 'Spain',
      path: '/assets/videos/famara.mp4',
      date: '2016-02-17',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Bine, Anna',
      guests: 'Uwe',
      camera: 'Sony Cybershot'
    },
    {
      id: 'puerto_del_rosario',
      name: 'Puerto del Rosario',
      description: 'Fuerteventura',
      country: 'Spain',
      path: '/assets/videos/puerto_del_rosario.mp4',
      date: '2016-02-18',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'santa_cruz',
      name: 'Santa Cruz',
      description: 'Tenerife',
      country: 'Spain',
      path: '/assets/videos/santa_cruz.mp4',
      date: '2016-02-19',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Bine, Stefan',
      peopleOut: 'Anna',
      guests: '',
      camera: 'Sony Cybershot'
    },
    {
      id: 'las_palmas',
      name: 'Las Palmas',
      description: 'Gran Canaria',
      country: 'Spain',
      path: '/assets/videos/las_palmas.mp4',
      date: '2016-02-20',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Bine, Stefan',
      guests: 'Uwe',
      camera: 'Sony Cybershot'
    },
    {
      id: 'reykjavik',
      name: 'Reykjavík',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/reykjavik.mp4',
      date: '2016-08-26',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'gullfoss',
      name: 'Gullfoss',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/gullfoss.mp4',
      date: '2016-08-28',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'landmannahellir',
      name: 'Landmannahellir',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/landmannahellir.mp4',
      date: '2016-08-29',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'kirkjubaejarklaustur',
      name: 'Kirkjubæjarklaustur',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/kirkjubaejarklaustur.mp4',
      date: '2016-08-30',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'joekulsarlon',
      name: 'Jökulsárlón',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/joekulsarlon.mp4',
      date: '2016-08-30',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'seydisfjoerdur',
      name: 'Seyðisfjörður',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/seydisfjoerdur.mp4',
      date: '2016-09-01',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'asbyrgi',
      name: 'Ásbyrgi',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/asbyrgi.mp4',
      date: '2016-09-02',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'hverfjall',
      name: 'Hverfjall',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/hverfjall.mp4',
      date: '2016-09-04',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'drangsnes',
      name: 'Drangsnes',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/drangsnes.mp4',
      date: '2016-09-07',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Stefan',
      peopleOut: 'Anna',
      guests: '',
      camera: 'Sony Alpha 6000'
    },
    {
      id: 'porskafjoerdur',
      name: 'Porskafjörður',
      description: '',
      country: 'Iceland',
      path: '/assets/videos/porskafjoerdur.mp4',
      date: '2016-09-09',
      latitude: 0.0,
      longitude: 0.0,
      peopleIn: 'Anna',
      peopleOut: 'Stefan',
      guests: '',
      camera: 'Sony Alpha 6000'
    }
  ]
});

export default Video;
