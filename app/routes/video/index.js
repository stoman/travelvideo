import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    let self = this;
    //find videos, then group them by country
    return new Ember.RSVP.Promise(function(resolve/*, reject*/) {
      self.store.query('video', {sortBy: 'name'}).then(function(videos) {
        let ret = {};
        videos.forEach(function(video) {
          if(!ret.hasOwnProperty(video.get('country'))) {
            ret[video.get('country')] = {country: video.get('country'), videos: []};
          }
          ret[video.get('country')].videos.push(video);
        });
        resolve(Object.keys(ret).sort().map(key => ret[key]));
      });
    });
  }
});
