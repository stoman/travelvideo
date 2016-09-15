import DS from 'ember-data';

var Path = DS.Model.extend({
  //attributes
  name: DS.attr('string'),
  year: DS.attr('string'),
  videos: DS.hasMany('video')
});

//fixtures: add more data here
Path.reopenClass({
  FIXTURES: [
    {
      id: 'random',
      name: 'Random Videos',
      year: '2013 - now'
    },
    {
      id: 'interrail',
      name: 'Interrail',
      year: '2013',
      videos: ['abisko']
    }
  ]
});

export default Path;
