# Настройка полномочий Flexberry с использованием Keycloak

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

Консоль администратора доступна по адресу: http://localhost:8080

### Добавление клиента в Keycloak
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
```js
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

## Добавление авторизации в серверную часть

### Добавление поддержки авторизации через токены

В веб-приложение серверной части необходимо добавить NuGet-пакет **Microsoft.AspNetCore.AuthenticationJwtBearer**, для версии .Net Core 3 используем версию 3.1.28

```Install-Package Microsoft.AspNetCore.Authentication.JwtBearer -Version 3.1.28```

В стартовом классе **Startup** в метод **ConfigureServices** добавить аутентификацию на основе токенов и авторизацию.

```cs
  services.AddAuthentication("Bearer")
      .AddJwtBearer("Bearer", options =>
      {
          options.Authority = "http://localhost:8080/realms/master/";
          if (Environment.IsDevelopment())
          {
              options.TokenValidationParameters = new TokenValidationParameters
              {
                  ValidateAudience = false,
              };
              options.RequireHttpsMetadata = false;
          }
      });

  services.AddAuthorization();
```
, где *Authority* - урл адреса сервера авторизации. в адрес включено название области keycloak.

В метод **Configure** добавить активацию авторизации и аутентификации:

```cs
  app.UseAuthentication();
  app.UseAuthorization();
```

После этих действий заработают механизмы ASP.Net Core идентификации на основе удостоверений, можно устанавливать атрибут ```[Authorize]``` для авктивации авторизации на контроллерах. Для защиты веб-страниц на ASP.Net данный способ не подходит, т.к. при попытке захода на страницу без авторизации будет выдан ответ 404, но в нашем случае браузерная часть работает на Ember, в которой авторизация и переадресация настроены.

### Добавление авторизации для OData

Для того чтобы авторизация заработала в OData необходимо настроить Flexberry Security.

#### Включение проверки подлинности у объектов

Включить проверку подлинности у объектов: в свойствах класса вкладка Полномочия, "Acces check type" выбрать **this** атрибут AccessType у сгенерированных классов должен выглядеть так:
```[AccessType(ICSSoft.STORMNET.AccessType.@this)]```

#### Реализация IUser

Реализовать интерфейс **ICSSoft.Services.CurrentUserService.IUser**, который извлекает имя пользователя из клаймов: 
```cs
  public string Login
  {
      get
      {
          return GetLogin();
      }
      set
      { }
  }
  
  private string GetLogin()
  {
      var currentClaims = (_contextAccessor.HttpContext.User?.Identity as ClaimsIdentity)?.Claims;
      if (!currentClaims.Any())
      {
          return null;
      }
      string agentClaim = currentClaims?.FirstOrDefault(p => p.Type == "preferred_username").Value;
      return agentClaim;
  }
```
#### Подключение реализации IUser и других зависимостей для Security

Зарегистрировать **IUser** и другие классы для **Security**:
```cs
private void RegisterORM(IUnityContainer container)
{
   ISecurityManager emptySecurityManager = new EmptySecurityManager();
   string securityConnectionString = connStr;
   IDataService securityDataService = new PostgresDataService(emptySecurityManager)
   {
       CustomizationString = securityConnectionString
   };

   ICacheService securityCacheService = new MemoryCacheService();
   ISecurityManager securityManager = new SecurityManager(securityDataService, securityCacheService, true);
   container.RegisterInstance<ISecurityManager>(securityManager, InstanceLifetime.Singleton);

   IHttpContextAccessor contextAccesor = new HttpContextAccessor();
   container.RegisterInstance<IHttpContextAccessor>(contextAccesor);
   container.RegisterType<IUser, User>();
   string mainConnectionString = connStr;
   IDataService mainDataService = new PostgresDataService()
   {
       CustomizationString = mainConnectionString
   };

   container.RegisterInstance<IDataService>(mainDataService, InstanceLifetime.Singleton);
}
```

## Добавление интерфейса управления полномочиями
Для удобного управления полномочиями можно интегрировать веб-интерфейс из пакета **ember-flexberry-security**.

### Добавление элементрв управления в приложение Ember
Установить пакет **ember-flexberry-security**:  ```ember install ember-flexberry-security```

Добавить соответствующие роуты в **router.js**:
```js
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

В контроллер **/controllers/application.js** добавить сайтмап для навигации по страницам Security:

```js
sitemapSecurity: computed('i18n.locale', function () {
 let i18n = this.get('i18n');

 return {
   nodes: [
     {
       link: null,
       caption: i18n.t('forms.application.sitemap.полномочия.caption'),
       title: i18n.t('forms.application.sitemap.полномочия.title'),
       children: [
         {
           link: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l',
           caption: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l.caption'),
           title: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l.title'),
           children: null
         },
         {
           link: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l',
           caption: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l.caption'),
           title: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-group-l.title'),
           children: null
         },
         {
           link: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-class-l',
           caption: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-class-l.caption'),
           title: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-class-l.title'),
           children: null
         },
         {
           link: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-l',
           caption: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-l.caption'),
           title: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-operation-l.title'),
           children: null
         },
         {
           link: 'i-c-s-soft-s-t-o-r-m-n-e-t-security-user-l',
           caption: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-user-l.caption'),
           title: i18n.t('forms.application.sitemap.полномочия.i-c-s-soft-s-t-o-r-m-n-e-t-security-user-l.title'),
           children: null
         }
       ]
     }
   ]
 };
}),
```
Можно было добавить в основной Sitemap, но отдельный нужен для того чтобы отображать его только для администраторов.
Также в этот контроллер добавить свойство для проверки прав администратора. В общем случае реализация может быть любая, в данном случае выполняется обращение к соотв. контроллеру.

```js
  isAdmin: computed('keycloakSession.keycloak.token', function() {
    const _this = this;
    fetch(`${config.APP.backendUrls.root}/api/IsAdmin`,{
      headers: {'Authorization': `Bearer ${this.keycloakSession.keycloak['token']}`}
    }
    ).then(function(response) {
      return response.text();
    }).then(function(text) {
      _this.set('isAdmin', text === "true");
    });
  }),
```

В шаблоне **/templates/application.hbs** добавить вывод панели полномочий:
```js
  {{#if isAdmin}}
    {{flexberry-sitemap-guideline sitemap=sitemapSecurity class="flexberry-sitemap"}}
  {{/if}}
```

Также для согласования множественных имен необходимо добавить несколько кастомных правил формирования окончаний, см. **models/custom-inflector-rules.js**:
```js
const inflector = Inflector.inflector;
inflector.irregular('entity', 'Entitys');
inflector.irregular('access', 'Accesss');
export default {};
```
, и импортировать его в app.js: ```import './models/custom-inflector-rules';```

Добавить ссылку на перевод в **locales\ru\translations.js**:
```js
import EmberFlexberrySecurityTranslations from 'ember-flexberry-security/locales/ru/translations';
...
$.extend(true, translations, ... , EmberFlexberrySecurityTranslations);
```

### Добавление поддержки управления полномочиями в серверную часть

В конфигурации OData добавить регистрацию сборки с объектами Security:

```cs
  app.UseODataService(builder =>
  {
      builder.MapFileRoute();

      var assemblies = new[]
      {
      ...
          typeof(Agent).Assembly,
      ...
      };
  });
```

Добавить обработчики для проверки доступа и удаления чувствительной информации:

```cs
  var modelBuilder = new DefaultDataObjectEdmModelBuilder(assemblies, true);
  var token = builder.MapDataObjectRoute(modelBuilder);
  token.Events.CallbackAfterGet = AfterGet;
  token.Events.CallbackBeforeCreate = BeforeHandler;
  token.Events.CallbackBeforeDelete = BeforeHandler;
  token.Events.CallbackBeforeUpdate = BeforeHandler;
```

```cs
  private static bool BeforeHandler(DataObject obj)
  {
      // Проверка на возможность манипулирования объектами Security только для админа.
      if (obj.GetType().Assembly == SecurityAssembly)
      {
          IUnityContainer container = UnityFactory.GetContainer();
          var user = container.Resolve<IUserWithRole>();
          return user.IsAdmin();
      }

      return true;
  }

  /// <summary>
  /// Выполнить дополнительную обработку объекта после вычитки.
  /// </summary>
  /// <param name="objs">Вычитанный объект.</param>
  public static void AfterGet(ref DataObject[] objs)
  {
      foreach (var obj in objs)
      {
          if (obj.GetType() == typeof(Agent))
          {
              ((Agent)obj).Pwd = null;
          }
      }
  }
```

Добавить в регистрацию классы для управления пользователями:
```cs
  private void RegisterORM(IUnityContainer container)
  {
      ...
      container.RegisterType<IPasswordHasher, EmptyPasswordHasher>();
      var agentManager = new AgentManager(securityDataService, securityCacheService);
      container.RegisterInstance<IAgentManager>(agentManager, InstanceLifetime.Singleton);
      ...
  }
```

Можно использовать **EmptyPasswordHasher** т.к. пароль из Security не используется.

Добавить интерфейс для работы с ролями пользователя:
```cs
  public interface IUserWithRole
  {
      bool UserInRole(string roleName);
      bool IsAdmin();
  }

```
И его реализацию:

```cs

  public bool UserInRole(string roleName)
  {
      // Проверка роли через Flexberry.
      if (_agentManager.IsCurrentUserInRole(roleName))
      {
          return true;
      }

      // Проверка роли через удостоверение.
      var claims = _contextAccessor.HttpContext.User.Claims.ToList();

      if (claims.Any(x => x.Type == ClaimTypes.Role && string.Equals (x.Value, _adminRoleName, System.StringComparison.InvariantCultureIgnoreCase)))
      {
          return true;
      }

      // Проверка роли из Keycloak.
      var scope = claims.FirstOrDefault(x => x.Type == "azp")?.Value;
      var resource_access = claims.FirstOrDefault(x => x.Type == "resource_access")?.Value;
      if (scope == null || resource_access == null)
      {
          return false;
      }
      var accessData = JsonConvert.DeserializeObject<JObject>(resource_access);
      var rights = accessData[scope]["roles"].Values<string>();
      return rights.Contains(roleName, _ignoreCaseStringComparer);
  }

  public bool IsAdmin()
  {
      return UserInRole(_adminRoleName);
  }

```
Ранее он использовался в **BeforeHandler** для проверки доступа только администратора к объектам Security.

Добавить контроллер проверки админских прав пользователя:
```cs
  [Authorize]
  [ApiController]
  [Route("api/[controller]")]
  public class IsAdminController : ControllerBase
  {

      private readonly IUserWithRole _user;

      public IsAdminController(IUserWithRole user)
      {
          _user = user;
      }
      
      [HttpGet]
      public IActionResult Get()
      {
          return Ok(_user.IsAdmin());
      }
  }
```
Вызов данного АПИ используется в приложении Ember при вычислении свойства isAdmin.