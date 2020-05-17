/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const BASE_URL = process.env.REACT_APP_BASE_URL

const bgSyncPlugin = new workbox.backgroundSync.Plugin('eventQueue', {
  maxRetentionTime: 24 * 60
});

workbox.routing.registerRoute(
  /\.(?:js|css|html)$/,
  workbox.strategies.networkFirst()
)

workbox.routing.registerRoute(
  `${BASE_URL}/lists`,
  workbox.strategies.networkFirst(),
  'GET'
)

workbox.routing.registerRoute(
  `${BASE_URL}/products`,
  workbox.strategies.networkFirst(),
  'GET'
)

workbox.routing.registerRoute(
  `${BASE_URL}/events`,
  workbox.strategies.networkFirst({
    plugins: [bgSyncPlugin]
  }),
  'POST'
)