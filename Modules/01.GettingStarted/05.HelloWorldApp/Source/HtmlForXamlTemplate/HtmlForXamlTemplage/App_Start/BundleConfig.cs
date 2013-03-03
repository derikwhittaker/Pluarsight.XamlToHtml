using System.Web;
using System.Web.Optimization;
using BundleTransformer.Core.Transformers;

namespace HtmlForXamlTemplage
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                       "~/Scripts/bootstrap.js",
                       "~/Scripts/knockout-{version}.js",
                       "~/Scripts/underscore.js",
                       "~/Scripts/moment.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/bootstrap.css",
                "~/Content/site.css"
                ));

            var typeScriptBundle = new ScriptBundle("~/bundles/ts")
                .IncludeDirectory("~/ViewModels", "*.ts", true);
            typeScriptBundle.Transforms.Add(new JsTransformer());
            bundles.Add(typeScriptBundle);
        }
    }
}