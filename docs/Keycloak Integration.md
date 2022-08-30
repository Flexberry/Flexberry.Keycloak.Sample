# Настройка полномочий Flexberry с использованием Keycloack

**Keycloak** - продукт с открытым кодом для реализации single sign-on (SSO) с возможностью управления доступом, нацелен на современные применения и сервисы.

## Установка и запуск Keycloak

### Запуск локальной копии
1. Скачать [архив](https://github.com/keycloak/keycloak/releases/download/19.0.1/keycloak-19.0.1.zip)
2. Распаковать и запустить ```.\keycloak-19.0.1\bin\kc.bat[.sh] start-dev```

**start-dev** запускает сервер в режиме разработки:
```
    + HTTP is enabled
    + Strict hostname resolution is disabled
    + Cache is set to local (No distributed cache mechanism used for high availability)
    + Theme- and Template-caching is disabled
```
### Запуск и использованием docker-compose
Выполнить команду ```docker-compose up``` со соедующим содержимым файла **docker-compose.yml**:
```yaml
version: '3'

services:
  keycloak:
    image: quay.io/keycloak/keycloak:19.0.1
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
```
### Консоль администратора
Консоль администратора доступна по адресу: http://localhost:8080

### Добавить клиент Keycloak
1. Зайти в панель администкатора Keycloak
2. Перейти в меню Clients
3. Добавить нового клиента "Create client"
4. Задать следующие настройки:
    - Client ID = **ember-app** - *ИД клиента, указывается при подключении.*
    - Valid redirect URIs =  **\*** - *Разрешенные адреса обратного вызова для передачи токена после авторизации. Звёздочка разрешает любой адрес, но в проде нужно указать конкретный адрес.*
    - Authentication flow = **Standard flow** - *сценарий авторизации. Описание сценариев можно посмотреть [тут](https://darutk.medium.com/diagrams-and-movies-of-all-the-oauth-2-0-flows-194f3c3ade85).*


## Добавление авторизации в приложение Ember

### Установка пакетов
В этом разделе описано добавление авторизации в клиентскую часть веб-приложения на Ember.

Для добавления авторизации в клиентскую часть веб-приложения на Ember можно воспользоватся пакетом ember-auth и библиотекой KeycloakJS, или воспользоваться готовым компонентом [ember-keycloak-auth](https://github.com/JFTechnology/ember-keycloak-auth).

Если используется версия Ember старше 3.8, нужно использовать версию ember-keycloak-auth 0.3.0 (без префикса @jftechnology):
```ember install ember-keycloak-auth@0.3.0```
Также необходимо обновить KeycloakJS до версии, соответствующей версии сервера Keycloak:
```npm install keycloak-js@19.0.1```

### Модификация роутов

В основной роут  приложения **/routes/application.js** добавить код настройки клиента Keycloak:
```js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class ApplicationRoute extends Route {
  keycloakSession: service(),
  init() {
    super.init(...arguments);
    const options = {
      url: 'http://localhost:8080',
      realm: 'master',
      clientId: 'ember-app',
    };
    this.keycloakSession.installKeycloak(options);
  }
  beforeModel() {
    return this.keycloakSession.initKeycloak();
  }
}
```
где, *realm* - название области Keycloak, а область по умолчанию называется *Master*.

В остальные роуты (или базовый) добавить миксин **KeycloakAuthenticatedRouteMixin**:
```
import KeycloakAuthenticatedRouteMixin from 'ember-keycloak-auth/mixins/keycloak-authenticated-route';

export default class BaseRoute extends Route.extend(KeycloakAuthenticatedRouteMixin) {
}
```
для автоматического получения нового токена перед переходом на роут, если текущий просрочен. 

### Модификация адаптеров

В адаптеры необходимо добавить mixin **KeycloakAdapterMixin**:
```js
import KeycloakAdapterMixin from 'ember-keycloak-auth/mixins/keycloak-adapter';
export default OdataAdapter.extend(AdapterMixin, KeycloakAdapterMixin, {
  host: config.APP.backendUrls.api,
});
```
для автоматического добавления токена авторизации к запросам к серверной части.

### Модификация fetch-запросов
Для прочих запросов необходимо добавить токен авторизации в заголовки:

```js
      fetch(`${config.APP.backendUrls.root}/api/GetData`,{
        headers: {'Authorization': `Bearer ${this.keycloakSession.keycloak['token']}`}
      }
```
### Модификация контроллеров
В контроллер **/controllers/application.js** добавить вычисление имени пользователя и метод выхода:

```js
    userName: computed('keycloakSession.tokenParsed.preferred_username', function() {
      return this.keycloakSession.tokenParsed.preferred_username;
    }),

    ...

  actions: {
    logout()
    {
        this.keycloakSession.logout();
    },
```

### Модификация шаблонов

В нужном месте, например в верхней части шаблона **/templates/application.hbs** добавить вывод имени пользователя и кнопку выхода:
```js
    <span>{{userName}}</span>
    <a {{action 'logout'}}>Logout</a>
```
Так же в примере добавлен хэлпер **/helpers/in-role.js**, позволяющий проверить роль из токена, которая назначена в Keycloak^

```js
{{#if (in-role 'Admin')}}
```

*В новой версии **ember-keycloak-auth** данный хэлпер идет в комплекте.*

### Модификация тестов

После добавления авторизации начнут падать тесты, т.к. будет выполнятся соотв переход.

Для отключения авторизации в тестах добавлен МОК-реадизация сервиса **keycloak-session**:
```js
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
```

Далее этот сервис зарегистрирован в **test/helpers/start-app.js**, или в другом подходящем месте:
```js
import keycloakSessionMock from '../test-services/keycloak-session';

...

application.__container__.owner.register('service:keycloakSession', keycloakSessionMock);
```

и добавлен в список **needs** тестов роутов:
```js
  needs: [
    'service:cols-config-menu',
...
    'service:keycloak-session',
  ],
```