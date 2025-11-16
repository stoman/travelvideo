import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { Promise } from 'rsvp';

//all data in this application is static and therefore loaded from fixtures
export default class ApplicationAdapter extends JSONAPIAdapter {
  // Override to load from fixtures instead of remote API
  async findRecord(store, type, id) {
    return this._loadFixture(type, id);
  }

  async findAll(store, type) {
    return this._loadAllFixtures(type);
  }

  async query(store, type, query) {
    let fixtures = this._getAllFixtures(type);
    let results = this.queryFixtures(fixtures, query);

    return {
      data: results.map(fixture => ({
        id: fixture.id,
        type: type.modelName,
        attributes: fixture
      }))
    };
  }

  _loadFixture(type, id) {
    const fixtures = this._getAllFixtures(type);
    const fixture = fixtures.find(f => f.id === id);

    if (!fixture) {
      return Promise.reject(new Error(`No fixture found for ${type.modelName} with id ${id}`));
    }

    return Promise.resolve({
      data: {
        id: fixture.id,
        type: type.modelName,
        attributes: fixture,
        relationships: this._buildRelationships(fixture)
      }
    });
  }

  _loadAllFixtures(type) {
    const fixtures = this._getAllFixtures(type);

    return Promise.resolve({
      data: fixtures.map(fixture => ({
        id: fixture.id,
        type: type.modelName,
        attributes: fixture,
        relationships: this._buildRelationships(fixture)
      }))
    });
  }

  _getAllFixtures(type) {
    // Access FIXTURES from the model class
    const modelClass = type.class || type;
    return modelClass.FIXTURES || [];
  }

  _buildRelationships(fixture) {
    const relationships = {};

    // Handle hasMany relationships (like videos in trip, trips in video)
    Object.keys(fixture).forEach(key => {
      if (Array.isArray(fixture[key]) && key !== 'id') {
        relationships[key] = {
          data: fixture[key].map(id => ({
            id: typeof id === 'object' ? id.id : id,
            type: key.slice(0, -1) // Remove 's' from plural
          }))
        };
      }
    });

    return relationships;
  }

  //Query fixtures for some data. `query` should be an object containing any or
  //multiple of those keys:
  // * filter: an object of keys and values each result should have
  // * sortBy: the name of a key to sort by in ascending order or the
  //   string `random`
  // * limit: the maximum number of results to return
  queryFixtures(fixtures, query /*, typeClass*/) {
    //setup variables
    let ret = Array();
    if (typeof query !== 'object') {
      throw 'query needs to be an object';
    }

    //apply filters
    fixtures.forEach(function (video) {
      let ok = true;
      if ('filter' in query) {
        if (typeof query.filter !== 'object') {
          throw 'query.filter needs to be an object';
        }
        Object.keys(query.filter).forEach(function (key) {
          if (typeof query.filter[key] !== 'string') {
            throw `query.filter.${key} needs to be a string`;
          }
          if (video[key] !== query.filter[key]) {
            ok = false;
          }
        });
      }
      if (ok) {
        ret.push(video);
      }
    });

    //sort data
    if ('sortBy' in query) {
      if (typeof query.sortBy !== 'string') {
        throw 'query.sortBy needs to be a string';
      }
      if (query.sortBy === 'random') {
        for (let i = ret.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          let temp = ret[i];
          ret[i] = ret[j];
          ret[j] = temp;
        }
      } else {
        ret = ret.sort((a, b) => a[query.sortBy] >= b[query.sortBy]);
      }
    }

    //limit data
    if ('limit' in query) {
      if (typeof query.limit !== 'number') {
        throw 'query.limit needs to be a number';
      }
      if (query.limit < 0) {
        throw 'query.limit should be positive';
      }
      if (query.limit < ret.length) {
        ret = ret.slice(0, query.limit);
      }
    }

    return ret;
  }
}
