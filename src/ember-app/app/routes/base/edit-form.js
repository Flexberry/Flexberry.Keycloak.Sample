import EditFormRoute from 'ember-flexberry/routes/edit-form';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';
export default class BaseEditFormRoute extends EditFormRoute.extend(KeycloakAuthenticatedRouteMixin) {
}
