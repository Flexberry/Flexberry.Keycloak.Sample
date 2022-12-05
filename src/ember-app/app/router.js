import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('t-v-keycloak-sample-chat-bot-message-l');
  this.route('t-v-keycloak-sample-chat-bot-message-e',
  { path: 't-v-keycloak-sample-chat-bot-message-e/:id' });
  this.route('t-v-keycloak-sample-chat-bot-message-e.new',
  { path: 't-v-keycloak-sample-chat-bot-message-e/new' });
  this.route('t-v-keycloak-sample-person-l');
  this.route('t-v-keycloak-sample-person-e',
  { path: 't-v-keycloak-sample-person-e/:id' });
  this.route('t-v-keycloak-sample-person-e.new',
  { path: 't-v-keycloak-sample-person-e/new' });
  this.route('t-v-keycloak-sample-person-meta-data-l');
  this.route('t-v-keycloak-sample-person-meta-data-e',
  { path: 't-v-keycloak-sample-person-meta-data-e/:id' });
  this.route('t-v-keycloak-sample-person-meta-data-e.new',
  { path: 't-v-keycloak-sample-person-meta-data-e/new' });
  this.route('t-v-keycloak-sample-request-person-data-l');
  this.route('t-v-keycloak-sample-request-person-data-e',
  { path: 't-v-keycloak-sample-request-person-data-e/:id' });
  this.route('t-v-keycloak-sample-request-person-data-e.new',
  { path: 't-v-keycloak-sample-request-person-data-e/new' });
  this.route('t-v-keycloak-sample-social-network-l');
  this.route('t-v-keycloak-sample-social-network-e',
  { path: 't-v-keycloak-sample-social-network-e/:id' });
  this.route('t-v-keycloak-sample-social-network-e.new',
  { path: 't-v-keycloak-sample-social-network-e/new' });

  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-class-l');
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-class-e',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-class-e/:id' });
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-class-e.new',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-class-e/new' });

  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l');
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-group-e',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-group-e/:id' });
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-group-e.new',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-group-e/new' });

  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-l');
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-e',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-e/:id' });
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-e.new',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-e/new' });

  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-role-l');
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-role-e',
  { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-role-e/:id' });
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-role-e.new',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-role-e/new' });

  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-user-l');
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-user-e',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-user-e/:id' });
  this.route('i-c-s-soft-s-t-o-r-m-n-e-t-security-user-e.new',
    { path: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-user-e/new' });
});

export default Router;
