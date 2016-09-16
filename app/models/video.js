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
  person_in: DS.attr('string'),
  person_out: DS.attr('string'),
  guests: DS.attr('string'),
  camera: DS.attr('string')
});

//fixtures: add more data here
Video.reopenClass({
  FIXTURES: [
    {
      id: 'abisko',
      name: 'Abisko',
      description: '',
      country: 'Sweden',
      path: '/data/videos/abisko.webm',
      date: '2013-01-01',
      latitude: 1.0,
      longitude: 2.0,
      person_in: 'Anna',
      person_out: 'Stefan',
      guests: '',
      camera: 'old'
    }
  ]
});

export default Video;