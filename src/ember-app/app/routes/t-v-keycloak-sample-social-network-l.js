import ListFormRoute from './base/list-form';
import { computed } from '@ember/object';
export default ListFormRoute.extend({
  /**
    Name of model projection to be used as record's properties limitation.

    @property modelProjection
    @type String
    @default 'SocialNetworkL'
  */
  modelProjection: 'SocialNetworkL',

  /**
    Name of model to be used as list's records types.

    @property modelName
    @type String
    @default 't-v-keycloak-sample-social-network'
  */
  modelName: 't-v-keycloak-sample-social-network',

  /**
    Defined user settings developer.
    For default userSetting use empty name ('').
    Property `<componentName>` may contain any of properties: `colsOrder`, `sorting`, `colsWidth` or being empty.

    ```javascript
    {
      <componentName>: {
        <settingName>: {
          colsOrder: [ { propName :<colName>, hide: true|false }, ... ],
          sorting: [{ propName: <colName>, direction: "asc"|"desc" }, ... ],
          colsWidths: [ <colName>:<colWidth>, ... ],
        },
        ...
      },
      ...
    }
    ```

    @property developerUserSettings
    @type Object
  */
  developerUserSettings: computed(function() {
    return { TVKeycloakSampleSocialNetworkL: {} }
  }),
});
