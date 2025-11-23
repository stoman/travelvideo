import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class RandomDisplayController extends Controller {
  @service store;
  @service router;

  @action
  async videoEnded() {
    const videos = await this.store.query('video', {
      filter: { peopleStart: this.model.peopleEnd },
      sortBy: 'random',
      limit: 1,
    });

    const nextVideo = videos[0];
    if (nextVideo) {
      this.router.transitionTo('random.display', nextVideo.id);
    }
  }
}
