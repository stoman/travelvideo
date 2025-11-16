import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class MapController extends Controller {
  @tracked hintVisible = true;

  @action
  hideHint() {
    this.hintVisible = false;
  }
}
