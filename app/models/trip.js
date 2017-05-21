import DS from 'ember-data';

var Trip = DS.Model.extend({
  //attributes
  name: DS.attr('string'),
  year: DS.attr('string'),
  videos: DS.hasMany('video')
});

//fixtures: add more data here
Trip.reopenClass({
  FIXTURES: [
    {
      id: 'interrail',
      name: 'Interrail',
      year: '2013',
      videos: ['munich_airport', 'stockholm_arlanda', 'abisko', 'narvik', 'lulea', 'kemi', 'oulu', 'helsinki', 'stockholm', 'skopje', 'sofia', 'belgrad', 'bar', 'dubrovnik', 'mostar', 'split', 'zagreb', 'ljubljana', 'salzburg', 'dahoam']
    },
    {
      id: 'china',
      name: 'China',
      year: '2014',
      videos: ['dubai','peking', 'peking2', 'zhangjiajie', 'zhangjiajie_nationalpark', 'guilin', 'tiantouzhai', 'tiantouzhai2', 'yangshuo', 'xingping', 'lijiang', 'tiger_leaping_gorge', 'hongkong']
    },
    {
      id: 'sicily',
      name: 'Sicily',
      year: '2015',
      videos: ['taormina', 'siracusa', 'etna']
    },
    {
      id: 'aida_canary_islands',
      name: 'AIDA Canary Islands',
      year: '2016',
      videos: ['funchal', 'famara', 'puerto_del_rosario', 'santa_cruz', 'las_palmas']
    },
    {
      id: 'iceland',
      name: 'Iceland',
      year: '2016',
      videos: ['reykjavik', 'gullfoss', 'landmannahellir', 'kirkjubaejarklaustur', 'joekulsarlon', 'seydisfjoerdur', 'asbyrgi', 'hverfjall', 'drangsnes', 'porskafjoerdur']
    }
  ]
});

export default Trip;
