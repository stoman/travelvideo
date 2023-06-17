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
      id: 'all',
      name: 'All Videos',
      year: '2013 - today',
      videos: ['munich_airport', 'stockholm_arlanda', 'abisko', 'narvik', 'lulea', 'kemi', 'oulu', 'helsinki', 'stockholm', 'skopje', 'sofia', 'belgrad', 'bar', 'dubrovnik', 'mostar', 'split', 'zagreb', 'ljubljana', 'salzburg', 'dahoam', 'dubai','peking', 'peking_olympic_park', 'zhangjiajie_tianmen_mountain', 'zhangjiajie_nationalpark', 'guilin', 'tiantouzhai', 'tiantouzhai2', 'yangshuo', 'xingping', 'lijiang', 'tiger_leaping_gorge', 'hongkong', 'taormina', 'siracusa', 'etna', 'funchal', 'famara', 'puerto_del_rosario', 'santa_cruz', 'las_palmas', 'reykjavik', 'gullfoss', 'landmannahellir', 'kirkjubaejarklaustur', 'joekulsarlon', 'seydisfjoerdur', 'asbyrgi', 'hverfjall', 'drangsnes', 'porskafjoerdur', 'dania_beach', 'miami_beach', 'miami', 'quito', 'mitad_del_mundo', 'cuyabeno', 'tortuga_bay', 'genovesa', 'bartolome', 'floreana', 'espanola', 'pasochoa', 'mindo', 'teleferiqo', 'new_york', 'new_york_liberty_island', 'lehel', 'osaka', 'nara', 'kyoto', 'hiroshima', 'mt_misen', 'himeji', 'murodo', 'matsumoto', 'tokyo', 'bangkok', 'haad_rin', 'chiang_mai', 'nam_tok', 'jakarta', 'borobudur', 'yogya', 'mt_bromo', 'ijen', 'sanur', 'auckland', 'waitomo', 'wairere_falls', 'hobbiton', 'waikite_valley', 'vinegar_hill', 'rivendell', 'karaka_point', 'lake_rotoiti', 'lyell', 'denniston', 'pancake_rocks', 'goldsborough', 'franz_josef', 'arthurs_pass', 'singapore', 'frankfurt', 'doha_corniche', 'doha', 'desert', 'windhuk', 'maun', 'okavango', 'victoria_falls', 'johannesburg', 'mumbai', 'udaipur', 'jaipur', 'agra', 'delhi', 'kuala_lumpur', 'melaka', 'san_francisco', 'big_sur', 'santa_barbara', 'los_angeles', 'las_vegas', 'grand_canyon', 'bryce_canyon', 'zion', 'death_valley', 'mountain_view', 'porto', 'favaios', 'alvao', 'carreco', 'oberschleissheim','weissenfels','thale','zorge','brocken','koenigssee','everglades1', 'everglades2', 'okeechobee', 'kennedy_space_center', 'puerto_plata', 'st_croix', 'basseterre', 'philipsburg', 'san_juan', 'labadee','sulina','obretin','bucuresti','bran','rasnov','ploiesti'],
      finished: false
    },
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
      videos: ['dania_beach', 'miami_beach', 'miami', 'quito', 'mitad_del_mundo', 'cuyabeno', 'tortuga_bay', 'genovesa', 'bartolome', 'floreana', 'espanola', 'pasochoa', 'mindo', 'teleferiqo', 'new_york', 'new_york_liberty_island', 'lehel', 'osaka', 'nara', 'kyoto', 'hiroshima', 'mt_misen', 'himeji', 'murodo', 'matsumoto', 'tokyo', 'bangkok', 'haad_rin', 'chiang_mai', 'nam_tok', 'jakarta', 'borobudur', 'yogya', 'mt_bromo', 'ijen', 'sanur', 'auckland', 'waitomo', 'wairere_falls', 'hobbiton', 'waikite_valley', 'vinegar_hill', 'rivendell', 'karaka_point', 'lake_rotoiti', 'lyell', 'denniston', 'pancake_rocks', 'goldsborough', 'franz_josef', 'arthurs_pass', 'singapore', 'frankfurt', 'doha_corniche', 'doha', 'desert', 'windhuk', 'maun', 'okavango', 'victoria_falls', 'johannesburg', 'mumbai', 'udaipur', 'jaipur', 'agra', 'delhi', 'kuala_lumpur', 'melaka'],
      finished: true
    },
    {
      id: 'westcoast_usa',
      name: 'Westcoast USA',
      year: '2018',
      videos: ['san_francisco', 'big_sur', 'santa_barbara', 'los_angeles', 'las_vegas', 'grand_canyon', 'bryce_canyon', 'zion', 'death_valley', 'mountain_view'],
      finished: true
    },
    {
      id: 'portugal',
      name: 'Portugal',
      year: '2019',
      videos: ['porto', 'favaios', 'alvao', 'carreco'],
      finished: true
    },
    {
      id: 'harz',
      name: 'Harzer Wandernadel',
      year: '2021',
      videos: ['thale', 'zorge', 'brocken'],
      finished: true
    },
    {
      id: 'caribbean',
      name: 'Artemis I & Caribbean',
      year: '2022',
      videos: ['everglades1', 'everglades2', 'okeechobee', 'kennedy_space_center', 'puerto_plata', 'st_croix', 'basseterre', 'philipsburg', 'san_juan', 'labadee'],
      finished: true
    },
    {
      id: 'romania',
      name: 'Romania',
      year: '2023',
      videos: ['sulina','obretin','bucuresti','bran','rasnov','ploiesti'],
      finished: true
    }
  ]
});

export default Trip;
