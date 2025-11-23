import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TripIndexRoute extends Route {
  @service store;
  async model() {
    const trips = await this.store.findAll('trip');
    await Promise.all(trips.map((t) => t.get('videos')));
    return trips;
  }

  titleToken = 'Trips';
}
