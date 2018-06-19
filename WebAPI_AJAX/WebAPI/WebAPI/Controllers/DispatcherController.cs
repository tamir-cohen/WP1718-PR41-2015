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
    public class DispatcherController : ApiController
    {
        // GET: api/Dispather/5
        public Dispatcher Get()
        {
            Dispatcher dispatcher = (Dispatcher)HttpContext.Current.Session["MyUser1"];

            return dispatcher;
        }

        // POST: api/Dispather
        public HttpResponseMessage Post([FromBody]Dispatcher value)
        {
            value.Role = Roles.Admin;
            HttpResponseMessage message = new HttpResponseMessage();

            if ((Users.Dispatchers.FirstOrDefault(disp => disp.UserName == value.UserName)) != null)
            {
                int index = Users.Dispatchers.IndexOf(Users.Dispatchers.FirstOrDefault(disp => disp.UserName == value.UserName));
                value.Drives = Users.Dispatchers[index].Drives;
                Users.Dispatchers[index] = value;
                HttpContext.Current.Session["MyUser1"] = value;
                message.StatusCode = HttpStatusCode.OK;
                return message;
            }

            message.StatusCode = HttpStatusCode.NotAcceptable;

            return message;
        }

        // PUT: api/Dispather/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Dispather/5
        public void Delete(int id)
        {
        }
    }
}
