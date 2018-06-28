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
            
            if(user.Role.ToString() == "Driver")
            {
                Driver driver = (Driver)HttpContext.Current.Session["MyUser1"];
                if (driver.Banned)
                    return false;
            }
            else if(user.Role.ToString() == "Customer")
            {
                Customer customer = (Customer)HttpContext.Current.Session["MyUser1"];
                if (customer.Banned)
                    return false;
            }

            if (user.Role.ToString() != Roles)
                return false;

            return true;
        }
    }
}