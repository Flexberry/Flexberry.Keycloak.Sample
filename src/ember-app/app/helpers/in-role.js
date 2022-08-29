import Ember from 'ember';
import { inject as service } from '@ember/service';

export default Ember.Helper.extend({

  keycloakSession: service(),

  /**
   * Delegates to the wrapped Keycloak instance's hasResourceRole method.
   *
   * @method compute
   * @param role {string} The role to check
   * @param resource {string} The resource to check
   * @return {boolean} True if user in role, else false.
   */
  compute([role, resource]) {
    return this.keycloakSession.hasResourceRole(role, resource);
  }
});
