import Service from '@ember/service';

export default Service.extend({
  tokenParsed: Object.freeze([{ preferred_username: 'UserName' }]),

  installKeycloak() { },

  initKeycloak(){
    return new Promise((resolve) => { resolve() });
  },

  logout() { },

  updateToken() {
    return new Promise((resolve) => { resolve() });
  }
});
