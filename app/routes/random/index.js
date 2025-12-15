import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RandomIndexRoute extends Route {
  @service store;
  @service router;

  async model() {
    const videos = await this.store.query('video', {
      sortBy: 'random',
      limit: 1,
    });
    if (videos && videos.length > 0) {
      const randomVideo = videos[0];
      this.router.transitionTo('random.display', randomVideo.id);
    }
  }
}
