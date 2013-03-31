using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace ToDo.Services
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultActionApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new {id = RouteParameter.Optional}
                );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            var matches = config.Formatters
                            .Where(f => f.SupportedMediaTypes.Any(m => m.MediaType.ToString() == "application/xml" ||
                                                                       m.MediaType.ToString() == "text/xml"))
                            .ToList();

            foreach (var match in matches)
            {
                config.Formatters.Remove(match);
            }
                  
        }
    }
}
