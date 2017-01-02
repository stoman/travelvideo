import FixtureAdapter from 'ember-data-fixture-adapter';

//all data in this application is static and therefore loeaded from fixtures
export default FixtureAdapter.extend({
  //the following two functions add the functionality of the commit
  //https://github.com/emberjs/ember-data-fixture-adapter/commit/ce93a14bfc4e4db1df67180b4646d0875dd79411
  //by bmac that is not contained in the npm repository yet
  findRecord(store, typeClass, id) {
  	return this.find(store, typeClass, id);
  },

  query(store, typeClass, query) {
    return this.findQuery(store, typeClass, query);
  },

  //Query fixtures for some data. `query` should be an object containing any or
  //multiple of those keys:
  // * filter: an object of keys and values each result should have
  // * sortBy: the name of a key to sort by in ascending order or the
  //   string `random`
  // * limit: the maximum number of results to return
  queryFixtures(fixtures, query/*, typeClass*/) {
    //setup variables
    let ret = Array();
    if(typeof query !== 'object') {
      throw "query needs to be an object";
    }

    //apply filters
    fixtures.forEach(function(video) {
      let ok = true;
      if('filter' in query) {
        if(typeof query.filter !== 'object') {
          throw "query.filter needs to be an object";
        }
        Object.keys(query.filter).forEach(function(key) {
          if(typeof query.filter[key] !== 'string') {
            throw `query.filter.${key} needs to be a string`;
          }
          if(video[key] !== query.filter[key]) {
            ok = false;
          }
        });
      }
      if(ok) {
        ret.push(video);
      }
    });

    //sort data
    if('sortBy' in query) {
      if(typeof query.sortBy !== 'string') {
        throw "query.sortBy needs to be a string";
      }
      if(query.sortBy === 'random') {
        ret = ret.sort(() => 0.5 - Math.random());
      }
      else {
        ret = ret.sort((a, b) => a[query.sortBy] >= b[query.sortBy]);
      }
    }

    //limit data
    if('limit' in query) {
      if(typeof query.limit !== 'number') {
        throw "query.limit needs to be a number";
      }
      if(query.limit < 0) {
        throw "query.limit should be positive";
      }
      if(query.limit < ret.length) {
        ret = ret.slice(0, query.limit);
      }
    }

    return ret;
  }
});
