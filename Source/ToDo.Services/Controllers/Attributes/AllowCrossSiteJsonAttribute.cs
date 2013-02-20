using System.Web.Http.Filters;

namespace ToDo.Services.Controllers.Attributes
{
    public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Response != null)
            {
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
                actionExecutedContext.Response.Headers.Add("Access-Control-Allow-Methods", "DELETE, POST, GET");
            }
                

            base.OnActionExecuted(actionExecutedContext);
        }
    }
}