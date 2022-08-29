namespace TV.KeycloakSample.Authentication
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// Пользователь с ролью.
    /// </summary>
    public interface IUserWithRole
    {
        /// <summary>
        /// Проверить имеет ли пользователь указанную роль.
        /// </summary>
        /// <param name="roleName">Название роли.</param>
        /// <returns>true, если пользователь имеет данную роль.</returns>
        bool UserInRole(string roleName);

        /// <summary>
        /// Проверить является ли пользователь администратором.
        /// </summary>
        /// <returns>true, если пользователь является администратором.</returns>
        bool IsAdmin();
    }
}
