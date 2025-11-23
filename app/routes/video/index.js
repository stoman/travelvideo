import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class VideoIndexRoute extends Route {
  @service store;

  async model() {
    //find videos, then group them by country
    const videos = await this.store.query('video', { sortBy: 'name' });

    const ret = {};
    let videoCount = 0;

    videos.forEach((video) => {
      videoCount++;
      const country = video.get('country');
      if (!Object.hasOwn(ret, country)) {
        ret[country] = {
          country: country,
          videos: [],
        };
      }
      ret[country].videos.push(video);
    });

    return {
      videos: Object.keys(ret)
        .sort()
        .map((key) => ret[key]),
      countVideos: videoCount,
      countCountries: Object.keys(ret).length,
    };
  }

  titleToken = 'Videos';
}
