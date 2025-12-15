import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class VideoListingComponent extends Component {
  @service metrics;

  //compute video quality
  get videoQuality() {
    return this.args.videoQuality || 'max';
  }

  @action
  videoEnded() {
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'end',
        label: this.args.video.id,
      });
    });

    if (this.args.onEnd) {
      this.args.onEnd();
    }
  }

  @action
  videoPaused() {
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'pause',
        label: this.args.video.id,
      });
    });
  }

  @action
  videoPlayed() {
    scheduleOnce('afterRender', this, () => {
      this.metrics.trackEvent('GoogleAnalytics', {
        category: 'video',
        action: 'play',
        label: this.args.video.id,
      });
    });
  }
}
