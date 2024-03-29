﻿namespace TV.KeycloakSample
{
    using System;
    using System.Linq;
    using System.Reflection;
    using System.Security.Claims;
    using ICSSoft.Services;
    using ICSSoft.STORMNET;
    using ICSSoft.STORMNET.Business;
    using ICSSoft.STORMNET.Security;
    using IIS.Caseberry.Logging.Objects;
    using Microsoft.AspNet.OData.Extensions;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.IdentityModel.Tokens;
    using NewPlatform.Flexberry.Caching;
    using NewPlatform.Flexberry.ORM.ODataService.Extensions;
    using NewPlatform.Flexberry.ORM.ODataService.Files;
    using NewPlatform.Flexberry.ORM.ODataService.Model;
    using NewPlatform.Flexberry.ORM.ODataService.WebApi.Extensions;
    using NewPlatform.Flexberry.ORM.ODataServiceCore.Common.Exceptions;
    using NewPlatform.Flexberry.Security;
    using NewPlatform.Flexberry.Services;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using TV.KeycloakSample.Authentication;
    using Unity;
    using static ICSSoft.Services.CurrentUserService;

    /// <summary>
    /// Класс настройки запуска приложения.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup" /> class.
        /// </summary>
        /// <param name="configuration">An application configuration properties.</param>
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        /// <summary>
        /// An application configuration properties.
        /// </summary>
        public IConfiguration Configuration { get; }

        private IWebHostEnvironment Environment { get; }



        /// <summary>
        /// Configurate application services.
        /// </summary>
        /// <remarks>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </remarks>
        /// <param name="services">An collection of application services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            string connStr = Configuration["DefConnStr"];

            var authorityUrl = Configuration["AuthorityUrl"];
            services.AddAuthentication("Bearer")
                .AddJwtBearer("Bearer", options =>
                {
                    options.Authority = authorityUrl;
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

            services.AddMvcCore(
                    options =>
                    {
                        options.Filters.Add<CustomExceptionFilter>();
                        options.EnableEndpointRouting = false;
                    })
                .AddFormatterMappings();

            services.AddOData();

            services.AddControllers().AddControllersAsServices();

            services.AddCors();
            services
                .AddHealthChecks()
                .AddNpgSql(connStr);
        }

        private static Assembly SecurityAssembly = typeof(Agent).Assembly;

        /// <summary>
        /// Configurate the HTTP request pipeline.
        /// </summary>
        /// <remarks>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </remarks>
        /// <param name="app">An application configurator.</param>
        /// <param name="env">Information about web hosting environment.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            LogService.LogInfo("Инициирован запуск приложения.");

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health");
            });

            app.UseODataService(builder =>
            {
                builder.MapFileRoute();

                var assemblies = new[]
                {
                    typeof(ObjectsMarker).Assembly,
                    typeof(ApplicationLog).Assembly,
                    typeof(UserSetting).Assembly,
                    SecurityAssembly,
                    typeof(Lock).Assembly,
                };

                var modelBuilder = new DefaultDataObjectEdmModelBuilder(assemblies, true);
                var token = builder.MapDataObjectRoute(modelBuilder);
                token.Events.CallbackAfterGet = AfterGet;
                token.Events.CallbackBeforeCreate = BeforeHandler;
                token.Events.CallbackBeforeDelete = BeforeHandler;
                token.Events.CallbackBeforeUpdate = BeforeHandler;
            });
        }

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

        /// <summary>
        /// Configurate application container.
        /// </summary>
        /// <param name="container">Container to configure.</param>
        public void ConfigureContainer(IUnityContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException(nameof(container));
            }

            // FYI: сервисы, в т.ч. контроллеры, создаются из дочернего контейнера.
            while (container.Parent != null)
            {
                container = container.Parent;
            }

            // FYI: сервис данных ходит в контейнер UnityFactory.
            container.RegisterInstance(Configuration);

            RegisterDataObjectFileAccessor(container);
            RegisterORM(container);
        }

        /// <summary>
        /// Register implementation of <see cref="IDataObjectFileAccessor"/>.
        /// </summary>
        /// <param name="container">Container to register at.</param>
        private void RegisterDataObjectFileAccessor(IUnityContainer container)
        {
            const string fileControllerPath = "api/file";
            string baseUriRaw = Configuration["BackendRoot"];
            if (string.IsNullOrEmpty(baseUriRaw))
            {
                throw new System.Configuration.ConfigurationErrorsException("BackendRoot is not specified in Configuration or enviromnent variables.");
            }

            Console.WriteLine($"baseUriRaw is {baseUriRaw}");
            var baseUri = new Uri(baseUriRaw);
            string uploadPath = Configuration["UploadUrl"];
            container.RegisterSingleton<IDataObjectFileAccessor, DefaultDataObjectFileAccessor>(
                Invoke.Constructor(
                    baseUri,
                    fileControllerPath,
                    uploadPath,
                    null));
        }


        /// <summary>
        /// Register ORM implementations.
        /// </summary>
        /// <param name="container">Container to register at.</param>
        private void RegisterORM(IUnityContainer container)
        {
            string connStr = Configuration["DefConnStr"];
            if (string.IsNullOrEmpty(connStr))
            {
                throw new System.Configuration.ConfigurationErrorsException("DefConnStr is not specified in Configuration or enviromnent variables.");
            }

            container.RegisterInstance(Configuration);

            container.RegisterType<IConfigResolver, ConfigResolver>(TypeLifetime.Singleton);

            ISecurityManager emptySecurityManager = new EmptySecurityManager();
            string securityConnectionString = connStr;
            IDataService securityDataService = new PostgresDataService(emptySecurityManager)
            {
                CustomizationString = securityConnectionString
            };

            ICacheService securityCacheService = new MemoryCacheService();
            ISecurityManager securityManager = new SecurityManager(securityDataService, securityCacheService, true);

            container.RegisterInstance<ISecurityManager>(securityManager, InstanceLifetime.Singleton);
            container.RegisterType<IPasswordHasher, EmptyPasswordHasher>();
            var agentManager = new AgentManager(securityDataService, securityCacheService);
            container.RegisterInstance<IAgentManager>(agentManager, InstanceLifetime.Singleton);
            IHttpContextAccessor contextAccesor = new HttpContextAccessor();
            container.RegisterInstance<IHttpContextAccessor>(contextAccesor);

            container.RegisterType<IUserWithRole, User>();
            container.RegisterType<IUser, User>();

            // Регистрируем основной DataService.
            string mainConnectionString = connStr;
            IDataService mainDataService = new PostgresDataService()
            {
                CustomizationString = mainConnectionString
            };

            container.RegisterInstance<IDataService>(mainDataService, InstanceLifetime.Singleton);

        }
    }
}
