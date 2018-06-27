using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;

namespace WebAPI.Models
{
    public class MyAuthorization : System.Web.Http.AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            if (HttpContext.Current.Session["MyUser1"] == null)
            {
                return false;
            }
            User user = (User)HttpContext.Current.Session["MyUser1"];
            string userRole = "";
            switch (user.Role)
            {
                case Models.Roles.Customer:
                    userRole = "Customer";
                    break;
                case Models.Roles.Admin:
                    userRole = "Admin";
                    break;
                case Models.Roles.Driver:
                    userRole = "Driver";
                    break;
                default:
                    break;
            }

            if (userRole != Roles)
                return false;

            return true;
        }
    }
}