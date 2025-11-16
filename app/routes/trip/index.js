import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TripIndexRoute extends Route {
  @service store;

  model() {
    //display all trips
    return this.store.query('trip', {});
  }
}
