/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const bgSyncPlugin = new workbox.backgroundSync.Plugin('eventQueue', {
  maxRetentionTime: 24 * 60
});

workbox.routing.registerRoute(
  /\.(?:js|css|html)$/,
  workbox.strategies.networkFirst()
)

workbox.routing.registerRoute(
  'http://localhost:5000/lists',
  workbox.strategies.networkFirst(),
  'GET'
)

workbox.routing.registerRoute(
  'http://localhost:5000/products',
  workbox.strategies.networkFirst(),
  'GET'
)

workbox.routing.registerRoute(
  'http://localhost:5000/events',
  workbox.strategies.networkFirst({
    plugins: [bgSyncPlugin]
  }),
  'POST'
)