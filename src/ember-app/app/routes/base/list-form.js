
import ListFormRoute from 'ember-flexberry/routes/list-form';
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';
export default class BaseListFormRoute extends ListFormRoute.extend(KeycloakAuthenticatedRouteMixin) {
}
