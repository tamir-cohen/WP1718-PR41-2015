using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebAPI.Models;

namespace WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            string pathA = Server.MapPath("~/App_Data/Admins.xml");
            string pathC = Server.MapPath("~/App_Data/Customers.xml");
            string pathD = Server.MapPath("~/App_Data/Drivers.xml");
            Users users = new Users(pathA, pathC, pathD);
        }

        public override void Init()
        {
            this.PostAuthenticateRequest += myPostAuthenticateRequest;
            base.Init();
        }

        void myPostAuthenticateRequest(object sender, EventArgs e)
        {
            HttpContext.Current.SetSessionStateBehavior(System.Web.SessionState.SessionStateBehavior.Required);
        }
    }
}
