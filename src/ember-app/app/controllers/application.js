import Controller from '@ember/controller';
import $ from 'jquery';
import { computed, observer } from '@ember/object';
import { isNone } from '@ember/utils';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default Controller.extend({
  sitemap: computed('i18n.locale', function () {
    let i18n = this.get('i18n');

    return {
      nodes: [
        {
          link: 'index',
          icon: 'home',
          caption: i18n.t('forms.application.sitemap.index.caption'),
          title: i18n.t('forms.application.sitemap.index.title'),
          children: null
        }, {
          link: null,
          icon: 'list',
          caption: i18n.t('forms.application.sitemap.metaverse.caption'),
          title: i18n.t('forms.application.sitemap.metaverse.title'),
          children: [{
            link: 't-v-keycloak-sample-chat-bot-message-l',
            caption: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-chat-bot-message-l.caption'),
            title: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-chat-bot-message-l.title'),
            icon: 'edit',
            children: null
          }, {
            link: 't-v-keycloak-sample-request-person-data-l',
            caption: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-request-person-data-l.caption'),
            title: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-request-person-data-l.title'),
            icon: 'tasks',
            children: null
          }, {
            link: 't-v-keycloak-sample-social-network-l',
            caption: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-social-network-l.caption'),
            title: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-social-network-l.title'),
            icon: 'tags',
            children: null
          }, {
            link: 't-v-keycloak-sample-person-meta-data-l',
            caption: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-person-meta-data-l.caption'),
            title: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-person-meta-data-l.title'),
            icon: 'phone',
            children: null
          }, {
            link: 't-v-keycloak-sample-person-l',
            caption: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-person-l.caption'),
            title: i18n.t('forms.application.sitemap.metaverse.t-v-keycloak-sample-person-l.title'),
            icon: 'list',
            children: null
          }]
        }
      ]
    };
  }),
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
  /**
    Locales supported by application.

    @property locales
    @type String[]
    @default ['ru', 'en']
  */
  locales: undefined,

  /**
    Handles changes in userSettingsService.isUserSettingsServiceEnabled.

    @method _userSettingsServiceChanged
    @private
  */
  _userSettingsServiceChanged: observer('userSettingsService.isUserSettingsServiceEnabled', function() {
    this.get('target.router').refresh();
  }),

  /**
    Initializes controller.
  */
  init() {
    this._super(...arguments);

    let i18n = this.get('i18n');
    if (isNone(i18n)) {
      return;
    }

    this.set('locales', ['ru', 'en']);

    // If i18n.locale is long value like 'ru-RU', 'en-GB', ... this code will return short variant 'ru', 'en', etc.
    let shortCurrentLocale = this.get('i18n.locale').split('-')[0];
    let availableLocales = A(this.get('locales'));

    // Force current locale to be one of available,
    // if browser's current language is not supported by dummy application,
    // or if browser's current locale is long value like 'ru-RU', 'en-GB', etc.
    if (!availableLocales.includes(shortCurrentLocale)) {
      i18n.set('locale', 'en');
    } else {
      i18n.set('locale', shortCurrentLocale);
    }
  },

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: service('objectlistview-events'),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),
  /**
    Service for user authorization session.

    @property keycloakSession
    @type KeycloakSessionService
  */
    keycloakSession: service(),

    /**
      User name from session data.
   */
    userName: computed('keycloakSession.tokenParsed.preferred_username', function() {
      return this.keycloakSession.tokenParsed.preferred_username;
    }),

    /**
      Is current user has admin role.
   */
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


  actions: {
  /**
    Performs user logout.

    @method actions.logout
  */
    logout()
    {
        this.keycloakSession.logout();
    },
    /**
      Call `updateWidthTrigger` for `objectlistviewEventsService`.

      @method actions.updateWidth
    */
    updateWidth() {
      this.get('objectlistviewEventsService').updateWidthTrigger();
    },

    /**
      Toggles application sitemap's side bar.

      @method actions.toggleSidebar
    */
    toggleSidebar() {
      let sidebar = $('.ui.sidebar.main.menu');
      sidebar.sidebar('toggle');
      sidebar.toggleClass('sidebar-mini');

      $('.full.height').toggleClass('content-opened');

      $('.sidebar.icon .text_menu').toggleClass('hidden');
      $('.sidebar.icon').toggleClass('text-menu-show');
      $('.sidebar.icon').toggleClass('text-menu-hide');
      $('.bgw-opacity').toggleClass('hidden');

      // For reinit overflowed tabs.
      $(window).trigger('resize');
    },

    /**
      Toggles application sitemap's side bar in mobile view.

      @method actions.toggleSidebarMobile
    */
    toggleSidebarMobile() {
      $('.ui.sidebar.main.menu').sidebar('toggle');

      $('.sidebar.icon').toggleClass('text-menu-show');
      $('.sidebar.icon').toggleClass('text-menu-hide');
      $('.sidebar.icon').toggleClass('hidden-text');
      $('.bgw-opacity').toggleClass('hidden');

      if (!this.get('_hideEventIsAttached')) {
        $('.ui.sidebar.main.menu').sidebar('attach events', '.ui.sidebar.main.menu .item a', 'hide');
        this.set('_hideEventIsAttached', true);
      }
    }
  }
});
