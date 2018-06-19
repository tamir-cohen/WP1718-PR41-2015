using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class DriverController : ApiController
    {
        public Driver Get()
        {
            Driver driver = (Driver)HttpContext.Current.Session["MyUser1"];

            return driver;
        }

        // POST: api/Dispather
        public HttpResponseMessage Post([FromBody]Driver value)
        {
            value.Role = Roles.Driver;
            HttpResponseMessage message = new HttpResponseMessage();

            if ((Users.Drivers.FirstOrDefault(disp => disp.UserName == value.UserName)) != null)
            {
                int index = Users.Drivers.IndexOf(Users.Drivers.FirstOrDefault(disp => disp.UserName == value.UserName));
                value.Drives = Users.Drivers[index].Drives;
                Users.Drivers[index] = value;
                HttpContext.Current.Session["MyUser1"] = value;
                message.StatusCode = HttpStatusCode.OK;
                return message;
            }

            message.StatusCode = HttpStatusCode.NotAcceptable;

            return message;
        }

        // PUT: api/Driver/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Driver/5
        public void Delete(int id)
        {
        }
    }
}
