using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace e_mutfak
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      string securityKey = "emutfak_jwt_security_key_2020";
      var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));

      services.Configure<CookiePolicyOptions>(options =>
      {
        options.CheckConsentNeeded = context => false;
        options.MinimumSameSitePolicy = SameSiteMode.None;
      });

      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters
          {
            //what to validate
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            //setup validate data
            ValidIssuer = "smesk.in",
            ValidAudience = "readers",
            IssuerSigningKey = symmetricSecurityKey
            //bu parametreler angularda config ve environment içine koyulacak.
          };

          options.Events = new JwtBearerEvents
          {
            OnTokenValidated = ctx =>
            {
              //Gerekirse burada gelen token içerisindeki çeşitli bilgilere göre doğrulama yapılabilir.
              return Task.CompletedTask;
            },
            OnAuthenticationFailed = ctx =>
            {
              Console.WriteLine("Exception:{0}", ctx.Exception.Message);
              return Task.CompletedTask;
            }
          };
        });

      services.AddCors(options => options.AddPolicy("Cors",
                         builder =>
                         {
                           builder
                                 .AllowAnyOrigin()
                                 .AllowAnyMethod()
                                 .AllowAnyHeader();
                         }));

      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
      services.AddMvc().AddSessionStateTempDataProvider();
      services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
      services.AddDistributedMemoryCache();
      services.AddSession(options =>
      {
        // Set a short timeout for easy testing.
        options.IdleTimeout = TimeSpan.FromDays(1);
        // Make the session cookie essential
        options.Cookie.IsEssential = true;
      });


      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseStaticFiles(Configuration["pathBase"]);
      app.UsePathBase(Configuration["pathBase"]);
      app.UseCors("Cors");
      app.UseAuthentication();
      app.UseSession();
      app.UseMvc();
    }
  }
}
