using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class DefaultController : ApiController
    {
        [HttpGet, Route("")]
        public RedirectResult Index()
        {
            var cookie = Request.Headers.GetCookies("MyUser").FirstOrDefault();
            if(cookie == null)
            {
                var requestUri = Request.RequestUri;
                return Redirect(requestUri.AbsoluteUri + "Login.html");
            }
            else
            {
                string CookieName = cookie["MyUser"].Value;
                User user = null;

                if ((user = Users.Dispatchers.FirstOrDefault(disp => disp.UserName == CookieName)) == null)
                    if ((user = Users.Customers.FirstOrDefault(disp => disp.UserName == CookieName)) == null)
                        user = Users.Drivers.FirstOrDefault(disp => disp.UserName == CookieName);

                if (user != null)
                {
                    HttpContext.Current.Session["MyUser1"] = user;

                    var requestUri = Request.RequestUri;
                    return Redirect(requestUri.AbsoluteUri + (user.Role.ToString() == "Admin" ? "Dispatcher" : user.Role.ToString()) + ".html");
                }
                else
                {
                    var requestUri = Request.RequestUri;
                    return Redirect(requestUri.AbsoluteUri + "Login.html");
                }
            }
        }
    }
}
