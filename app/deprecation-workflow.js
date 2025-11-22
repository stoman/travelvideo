import setupDeprecationWorkflow from 'ember-cli-deprecation-workflow';

/**
 * Docs: https://github.com/ember-cli/ember-cli-deprecation-workflow
 */
setupDeprecationWorkflow({
  /**
    false by default, but if a developer / team wants to be more aggressive about being proactive with
    handling their deprecations, this should be set to "true"
  */
  throwOnUnhandled: false,
  workflow: [
    // Silence WarpDrive internal deprecations
    // These are triggered internally by ember-data when using store.createRecord
    // and other store methods. Cannot be avoided without migrating away from
    // the traditional adapter/serializer pattern to WarpDrive's RequestManager.
    // Will be resolved when upgrading to ember-data 6.0.
    {
      handler: 'silence',
      matchId: 'warp-drive:deprecate-legacy-request-methods',
    },
  ],
});
