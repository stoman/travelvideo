import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class VideoListingComponent extends Component {
  //compute video quality
  get videoQuality() {
    return this.args.videoQuality || 'max';
  }

  @action
  videoEnded() {
    if (this.args.onEnd) {
      this.args.onEnd();
    }
  }
}
