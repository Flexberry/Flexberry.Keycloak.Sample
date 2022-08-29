import $ from 'jquery';
import EmberFlexberryTranslations from 'ember-flexberry/locales/ru/translations';
import EmberFlexberrySecurityTranslations from 'ember-flexberry-security/locales/ru/translations';
import ICSSoftSTORMNETSecurityAccessEForm from 'ember-flexberry-security/locales/ru/forms/i-c-s-soft-s-t-o-r-m-n-e-t-security-access-e';

import TVKeycloakSampleChatBotMessageLForm from './forms/t-v-keycloak-sample-chat-bot-message-l';
import TVKeycloakSamplePersonLForm from './forms/t-v-keycloak-sample-person-l';
import TVKeycloakSamplePersonMetaDataLForm from './forms/t-v-keycloak-sample-person-meta-data-l';
import TVKeycloakSampleRequestPersonDataLForm from './forms/t-v-keycloak-sample-request-person-data-l';
import TVKeycloakSampleSocialNetworkLForm from './forms/t-v-keycloak-sample-social-network-l';
import TVKeycloakSampleChatBotMessageEForm from './forms/t-v-keycloak-sample-chat-bot-message-e';
import TVKeycloakSamplePersonEForm from './forms/t-v-keycloak-sample-person-e';
import TVKeycloakSamplePersonMetaDataEForm from './forms/t-v-keycloak-sample-person-meta-data-e';
import TVKeycloakSampleRequestPersonDataEForm from './forms/t-v-keycloak-sample-request-person-data-e';
import TVKeycloakSampleSocialNetworkEForm from './forms/t-v-keycloak-sample-social-network-e';
import TVKeycloakSampleChatBotMessageModel from './models/t-v-keycloak-sample-chat-bot-message';
import TVKeycloakSamplePersonAccountModel from './models/t-v-keycloak-sample-person-account';
import TVKeycloakSamplePersonMetaDataModel from './models/t-v-keycloak-sample-person-meta-data';
import TVKeycloakSamplePersonModel from './models/t-v-keycloak-sample-person';
import TVKeycloakSampleRequestPersonDataModel from './models/t-v-keycloak-sample-request-person-data';
import TVKeycloakSampleSocialNetworkModel from './models/t-v-keycloak-sample-social-network';

const translations = {};
$.extend(true, translations, EmberFlexberryTranslations, EmberFlexberrySecurityTranslations, ICSSoftSTORMNETSecurityAccessEForm);

$.extend(true, translations, {
  models: {
    't-v-keycloak-sample-chat-bot-message': TVKeycloakSampleChatBotMessageModel,
    't-v-keycloak-sample-person-account': TVKeycloakSamplePersonAccountModel,
    't-v-keycloak-sample-person-meta-data': TVKeycloakSamplePersonMetaDataModel,
    't-v-keycloak-sample-person': TVKeycloakSamplePersonModel,
    't-v-keycloak-sample-request-person-data': TVKeycloakSampleRequestPersonDataModel,
    't-v-keycloak-sample-social-network': TVKeycloakSampleSocialNetworkModel
  },

  'application-name': 'Metaverse',

  forms: {
    loading: {
      'spinner-caption': 'Данные загружаются, пожалуйста подождите...'
    },
    index: {
      greeting: 'Добро пожаловать на тестовый стенд ember-flexberry!'
    },

    application: {
      header: {
        menu: {
          'sitemap-button': {
            title: 'Меню'
          },
          'user-settings-service-checkbox': {
            caption: 'Использовать сервис сохранения пользовательских настроек'
          },
          'show-menu': {
            caption: 'Показать меню'
          },
          'hide-menu': {
            caption: 'Скрыть меню'
          },
          'language-dropdown': {
            caption: 'Язык приложения',
            placeholder: 'Выберите язык'
          }
        },
        login: {
          caption: 'Вход'
        },
        logout: {
          caption: 'Выход'
        }
      },

      footer: {
        'application-name': 'Metaverse',
        'application-version': {
          caption: 'Версия аддона {{version}}',
          title: 'Это версия аддона ember-flexberry, которая сейчас используется в этом тестовом приложении ' +
          '(версия npm-пакета + хэш коммита). ' +
          'Кликните, чтобы перейти на GitHub.'
        }
      },

      sitemap: {
        'application-name': {
          caption: 'Metaverse',
          title: 'Metaverse'
        },
        'application-version': {
          caption: 'Версия аддона {{version}}',
          title: 'Это версия аддона ember-flexberry, которая сейчас используется в этом тестовом приложении ' +
          '(версия npm-пакета + хэш коммита). ' +
          'Кликните, чтобы перейти на GitHub.'
        },
        index: {
          caption: 'Главная',
          title: ''
        },
        metaverse: {
          caption: 'Metaverse',
          title: 'Metaverse',
          't-v-keycloak-sample-chat-bot-message-l': {
            caption: 'Chat bot message',
            title: ''
          },
          't-v-keycloak-sample-request-person-data-l': {
            caption: 'Request person data',
            title: ''
          },
          't-v-keycloak-sample-social-network-l': {
            caption: 'Social network',
            title: ''
          },
          't-v-keycloak-sample-person-meta-data-l': {
            caption: 'Person meta data',
            title: ''
          },
          't-v-keycloak-sample-person-l': {
            caption: 'Person',
            title: ''
          }
        }
      }
    },

    'edit-form': {
      'save-success-message-caption': 'Сохранение завершилось успешно',
      'save-success-message': 'Объект сохранен',
      'save-error-message-caption': 'Ошибка сохранения',
      'delete-success-message-caption': 'Удаление завершилось успешно',
      'delete-success-message': 'Объект удален',
      'delete-error-message-caption': 'Ошибка удаления'
    },
    't-v-keycloak-sample-chat-bot-message-l': TVKeycloakSampleChatBotMessageLForm,
    't-v-keycloak-sample-person-l': TVKeycloakSamplePersonLForm,
    't-v-keycloak-sample-person-meta-data-l': TVKeycloakSamplePersonMetaDataLForm,
    't-v-keycloak-sample-request-person-data-l': TVKeycloakSampleRequestPersonDataLForm,
    't-v-keycloak-sample-social-network-l': TVKeycloakSampleSocialNetworkLForm,
    't-v-keycloak-sample-chat-bot-message-e': TVKeycloakSampleChatBotMessageEForm,
    't-v-keycloak-sample-person-e': TVKeycloakSamplePersonEForm,
    't-v-keycloak-sample-person-meta-data-e': TVKeycloakSamplePersonMetaDataEForm,
    't-v-keycloak-sample-request-person-data-e': TVKeycloakSampleRequestPersonDataEForm,
    't-v-keycloak-sample-social-network-e': TVKeycloakSampleSocialNetworkEForm
  },

});

export default translations;
