import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RandomIndexRoute extends Route {
  @service store;
  @service router;

  //redirect to a random video
  async beforeModel() {
    const videos = await this.store.query('video', {
      sortBy: 'random',
      limit: 1,
    });
    this.router.transitionTo('random.display', videos[0].get('id'));
  }

  titleToken = 'Random Video';
}
