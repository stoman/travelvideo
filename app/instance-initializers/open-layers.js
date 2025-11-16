export function initialize(appInstance) {
  // Initialize the map-manager service when the app starts
  // This ensures the service starts listening to router events
  appInstance.lookup('service:map-manager');
}

export default {
  name: 'open-layers',
  initialize,
};
