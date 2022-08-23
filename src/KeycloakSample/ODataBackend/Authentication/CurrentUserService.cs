namespace TV.KeycloakSample.Authentication
{
    using System.Linq;
    using System.Security.Claims;
    using Microsoft.AspNetCore.Http;

    public class CurrentUserService : ICSSoft.Services.CurrentUserService.IUser
    {
        IHttpContextAccessor contextAccessor;

        public CurrentUserService(IHttpContextAccessor contextAccessor)
        {
            this.contextAccessor = contextAccessor;
        }

        /// <summary>
        /// Логин пользователя.
        /// 
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
        /// 
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
        /// 
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

        private string GetLogin()
        {
            var currentClaims = (contextAccessor.HttpContext.User?.Identity as ClaimsIdentity)?.Claims;
            if (!currentClaims.Any())
            {
                return null;
            }

            string agentClaim = currentClaims?.FirstOrDefault(p => p.Type == "preferred_username").Value;
            return agentClaim;
        }
    }
}
