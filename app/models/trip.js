import DS from 'ember-data';

var Trip = DS.Model.extend({
  //attributes
  name: DS.attr('string'),
  year: DS.attr('string'),
  videos: DS.hasMany('video'),
  finished: DS.attr('boolean')
});

//fixtures: add more data here
Trip.reopenClass({
  FIXTURES: [
    {
      id: 'interrail',
      name: 'Interrail',
      year: '2013',
      videos: ['munich_airport', 'stockholm_arlanda', 'abisko', 'narvik', 'lulea', 'kemi', 'oulu', 'helsinki', 'stockholm', 'skopje', 'sofia', 'belgrad', 'bar', 'dubrovnik', 'mostar', 'split', 'zagreb', 'ljubljana', 'salzburg', 'dahoam'],
      finished: true
    },
    {
      id: 'china',
      name: 'China',
      year: '2014',
      videos: ['dubai','peking', 'peking_olympic_park', 'zhangjiajie_tianmen_mountain', 'zhangjiajie_nationalpark', 'guilin', 'tiantouzhai', 'tiantouzhai2', 'yangshuo', 'xingping', 'lijiang', 'tiger_leaping_gorge', 'hongkong'],
      finished: true
    },
    {
      id: 'sicily',
      name: 'Sicily',
      year: '2015',
      videos: ['taormina', 'siracusa', 'etna'],
      finished: true
    },
    {
      id: 'aida_canary_islands',
      name: 'AIDA Canary Islands',
      year: '2016',
      videos: ['funchal', 'famara', 'puerto_del_rosario', 'santa_cruz', 'las_palmas'],
      finished: true
    },
    {
      id: 'iceland',
      name: 'Iceland',
      year: '2016',
      videos: ['reykjavik', 'gullfoss', 'landmannahellir', 'kirkjubaejarklaustur', 'joekulsarlon', 'seydisfjoerdur', 'asbyrgi', 'hverfjall', 'drangsnes', 'porskafjoerdur'],
      finished: true
    },
    {
      id: 'world',
      name: 'Around the World',
      year: '2017',
      videos: ['dania_beach', 'miami_beach', 'miami', 'quito', 'mitad_del_mundo', 'cuyabeno', 'tortuga_bay', 'genovesa', 'bartolome', 'floreana', 'espanola', 'pasochoa', 'mindo', 'teleferiqo', 'new_york', 'new_york_liberty_island', 'lehel', 'osaka', 'nara', 'kyoto', 'hiroshima', 'mt_misen', 'himeji', 'murodo', 'matsumoto', 'tokyo', 'bangkok', 'haad_rin', 'chiang_mai', 'nam_tok', 'jakarta', 'borobudur', 'yogya', 'mt_bromo', 'ijen', 'sanur', 'auckland', 'waitomo', 'wairere_falls', 'hobbiton', 'waikite_valley', 'vinegar_hill', 'rivendell', 'karaka_point', 'lake_rotoiti', 'lyell', 'denniston', 'pancake_rocks', 'goldsborough', 'franz_josef', 'arthurs_pass', 'singapore'], 
      finished: false
    }
  ]
});

export default Trip;
