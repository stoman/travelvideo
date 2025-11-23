import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import config from 'travelvideo/config/environment';

module('Acceptance | google analytics', function (hooks) {
  setupApplicationTest(hooks);

  test('ember-metrics service is configured with GoogleAnalyticsFour', async function (assert) {
    await visit('/');

    // Get the metrics service
    const metricsService = this.owner.lookup('service:metrics');
    assert.ok(metricsService, 'metrics service should exist');

    // Verify GoogleAnalyticsFour adapter is configured
    const metricsConfig = config.metricsAdapters;
    assert.ok(metricsConfig, 'metricsAdapters should be configured');

    const ga4Adapter = metricsConfig.find(
      (adapter) => adapter.name === 'GoogleAnalyticsFour',
    );
    assert.ok(ga4Adapter, 'GoogleAnalyticsFour adapter should be configured');
    assert.strictEqual(
      ga4Adapter.config.id,
      'G-V757JDJL11',
      'GA4 measurement ID should be G-V757JDJL11',
    );
  });

  test('GoogleAnalyticsFour adapter is disabled in test environment', async function (assert) {
    await visit('/');

    const metricsConfig = config.metricsAdapters;
    const ga4Adapter = metricsConfig.find(
      (adapter) => adapter.name === 'GoogleAnalyticsFour',
    );

    assert.notOk(
      ga4Adapter.environments.includes('test'),
      'GoogleAnalyticsFour should NOT be enabled in test environment',
    );
    assert.ok(
      ga4Adapter.environments.includes('development'),
      'GoogleAnalyticsFour should be enabled in development environment',
    );
    assert.ok(
      ga4Adapter.environments.includes('production'),
      'GoogleAnalyticsFour should be enabled in production environment',
    );
  });
});
