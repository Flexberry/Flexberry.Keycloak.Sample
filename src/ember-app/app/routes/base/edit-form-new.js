import EditFormNewRoute from 'ember-flexberry/routes/edit-form-new';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';
export default class BaseEditFormNewRoute extends EditFormNewRoute.extend(KeycloakAuthenticatedRouteMixin) {
}
