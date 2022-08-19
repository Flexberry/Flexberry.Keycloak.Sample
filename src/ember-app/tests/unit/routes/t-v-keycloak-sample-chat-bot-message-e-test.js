import { moduleFor, test } from 'ember-qunit';

moduleFor('route:t-v-keycloak-sample-chat-bot-message-e', 'Unit | Route | t-v-keycloak-sample-chat-bot-message-e', {
  // Specify the other units that are required for this test.
  needs: [
    'service:cols-config-menu',
    'service:detail-interaction',
    'service:objectlistview-events',
    'service:user-settings',
    'service:app-state',
    'service:adv-limit',
    'service:keycloak-session',
  ],
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
