import FixtureAdapter from 'ember-data-fixture-adapter';

//all data in this application is static and therefore loeaded from fixtures
export default FixtureAdapter.extend({
  //the following functions add the functionality of the commit
  //https://github.com/emberjs/ember-data-fixture-adapter/commit/ce93a14bfc4e4db1df67180b4646d0875dd79411
  //by bmac that is not contained in the npm repository yet
  findRecord(store, typeClass, id) {
  	return this.find(store, typeClass, id);
  },

  query(store, typeClass, query) {
    return this.findQuery(store, typeClass, query);
  }
});
