import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let self = this;
    //find videos, then group them by country
    return new Ember.RSVP.Promise(function(resolve/*, reject*/) {
      self.store.query('video', {sortBy: 'name'}).then(function(videos) {
        let ret = {};
        let videoCount = 0;
        videos.forEach(function(video) {
          videoCount++;
          if(!ret.hasOwnProperty(video.get('country'))) {
            ret[video.get('country')] = {country: video.get('country'), videos: []};
          }
          ret[video.get('country')].videos.push(video);
        });
        resolve({
          videos: Object.keys(ret).sort().map(key => ret[key]),
          countVideos: videoCount,
          countCountries: Object.keys(ret).length
        });
      });
    });
  }
});
