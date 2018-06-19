using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class RegistrationController : ApiController
    {
        // GET: api/Registration
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Registration/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Registration
        public HttpResponseMessage Post([FromBody]Customer value)
        {
            value.Role = Roles.Customer;
            HttpResponseMessage message = new HttpResponseMessage();

            if ((Users.Dispatchers.FirstOrDefault(disp => disp.UserName == value.UserName)) == null)
                if (Users.Customers.FirstOrDefault(disp => disp.UserName == value.UserName) == null)
                    if(Users.Drivers.FirstOrDefault(disp => disp.UserName == value.UserName) == null)
                    {
                        Users.Customers.Add(value);
                        message.StatusCode = HttpStatusCode.OK;
                        return message;
                    }

            message.StatusCode = HttpStatusCode.NotAcceptable;

            return message;
        }

        // PUT: api/Registration/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Registration/5
        public void Delete(int id)
        {
        }
    }
}
