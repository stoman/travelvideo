import Component from '@ember/component';

export default Component.extend({
  //model data
  video: null,
  //settings
  autoplay: false,
  controls: false,

  //compute video quality
  videoQuality: 'max',

  //actions
  actions: {
    //callback when video ends
    videoEnded() {
      let end = this.onEnd;
      if(end) {
        end();
      }
    }
  },

  //after rendering start video
  didRender() {
    if(this.autoplay) {
        window.setTimeout(function() {
        for(let videoTag of this.$('video')) {
          videoTag.play();
        }
      }, 5000);
    }
  }
});
