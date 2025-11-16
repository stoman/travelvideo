import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;

  //redirect the index route to the trips route
  beforeModel() {
    super.beforeModel(...arguments);
    this.router.replaceWith('trip.index');
  }
}
