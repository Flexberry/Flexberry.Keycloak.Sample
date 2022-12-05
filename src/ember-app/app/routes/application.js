import Route from '@ember/routing/route';
import ModalApplicationRouteMixin from 'ember-flexberry/mixins/modal-application-route';
import { inject as service } from '@ember/service';
import config from '../config/environment';
export default Route.extend(ModalApplicationRouteMixin, {

  /**
    Service for user authorization session.

    @property keycloakSession
    @type KeycloakSessionService
  */
  keycloakSession: service(),
  /**
   * Collect keycloak options and install the Keycloak service.
   */
  init() {
    this._super(...arguments);
    const authSettings = config.KeycloakAuthSettings;
    this.keycloakSession.checkLoginIframe = authSettings.checkLoginIframe;
    this.keycloakSession.responseMode = authSettings.responseMode;
    this.keycloakSession.installKeycloak(authSettings.ClientOptions);
  },

  /**
   * Use before model hook to initiate the wrapped Keycloak service. This returns a promise that the framework will
   * resolve before the application transitions to child routes.
   */
  beforeModel() {
    return this.keycloakSession.initKeycloak();
  }
})
