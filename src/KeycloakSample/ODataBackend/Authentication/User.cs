namespace TV.KeycloakSample.Authentication
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using System.Linq;
    using System.Security.Claims;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using NewPlatform.Flexberry.Security;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Сервис информации о пользователе.
    /// </summary>
    public class User : ICSSoft.Services.CurrentUserService.IUser, IUserWithRole
    {
        /// <summary>
        /// Компаратор строк без учета регистра.
        /// </summary>
        private class IgnoreCaseStringComparer : IEqualityComparer<string>
        {
            public bool Equals([AllowNull] string x, [AllowNull] string y)
            {
                if (x == null)
                {
                    return y == null;
                }
                return x.Equals(y, System.StringComparison.InvariantCultureIgnoreCase);
            }

            public int GetHashCode([DisallowNull] string obj)
            {
                return obj.GetHashCode();
            }
        }

        private static IgnoreCaseStringComparer _ignoreCaseStringComparer = new IgnoreCaseStringComparer();
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IAgentManager _agentManager;
        private readonly string _adminRoleName;

        public User(IHttpContextAccessor contextAccessor, IAgentManager agentManager, IConfiguration configuration)
        {
            _contextAccessor = contextAccessor;
            _agentManager = agentManager;
            _adminRoleName = configuration["AdminRoleName"];
        }

        /// <summary>
        /// Логин пользователя.
        /// </summary>
        public string Login
        {
            get
            {
                return GetLogin();
            }
            set
            { }
        }

        /// <summary>
        /// Домен пользователя.
        /// </summary>
        public string Domain
        {
            get
            {
                return null;
            }
            set { }
        }

        /// <summary>
        /// Имя пользователя.
        /// </summary>
        public string FriendlyName
        {
            get
            {
                return Login;
            }
            set
            { }
        }

        /// <summary>
        /// <inheritdoc cref="IUserWithRole"/>
        /// </summary>
        public bool UserInRole(string roleName)
        {
            // Проверка роли через Flexberry.
            if (_agentManager.IsCurrentUserInRole(roleName))
            {
                return true;
            }

            // Проверка роли через заявки.
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

        /// <summary>
        /// <inheritdoc cref="IUserWithRole"/>
        /// </summary>
        public bool IsAdmin()
        {
            return UserInRole(_adminRoleName);
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
    }
}
