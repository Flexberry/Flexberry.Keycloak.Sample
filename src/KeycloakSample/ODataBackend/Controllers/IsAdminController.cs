namespace TV.KeycloakSample.Controllers
{
    using Microsoft.AspNet.OData;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Linq;
    using TV.KeycloakSample.Authentication;

    /// <summary>
    /// Контроллер для проверки является ли пользователь администратором.
    /// </summary>
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

        /// <summary>
        /// Проверить является ли пользователь администратором.
        /// </summary>
        /// <returns>true, если пользователь имеет роль администратор.</returns>
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_user.IsAdmin());
        }
    }
}
