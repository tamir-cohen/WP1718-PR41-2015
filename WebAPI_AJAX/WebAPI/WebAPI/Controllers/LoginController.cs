using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class Test
    {
        public string username { get; set; }
        public string password { get; set; }
        public string remember { get; set; }
        public Test(string username, string password, string remember)
        {
            this.username = username;
            this.password = password;
            this.remember = remember;
        }

        public Test()
        {

        }
    }
    public class LoginController : ApiController
    {
        // GET: api/Login
        [HttpGet]
        [Route("api/Login/LogOut")]
        public HttpResponseMessage LogOut()
        {
            Users.WriteToFile();

            var resp = new HttpResponseMessage();

            var cookie = HttpContext.Current.Response.Cookies["MyUser"];
            if(cookie != null)
            {
                HttpContext.Current.Response.Cookies["MyUser"].Value = null;
                HttpContext.Current.Response.Cookies["MyUser"].Expires = DateTime.Now.AddDays(-1);
            }            

            HttpContext.Current.Session.Abandon();
            resp.StatusCode = HttpStatusCode.OK;

            return resp;
        }

        // GET: api/Login/
        [HttpGet]
        [Route("api/Login/SaveCookie/")]
        public HttpResponseMessage SaveCookie(string un)
        {
            var resp = new HttpResponseMessage();

            var cookie = new CookieHeaderValue("MyUser", un)
            {
                Expires = DateTimeOffset.Now.AddDays(1),
                Domain = Request.RequestUri.Host,
                Path = "/"
            };
            resp.Headers.AddCookies(new CookieHeaderValue[] { cookie });
            return resp;
        }

        // POST: api/Login
        public string Post([FromBody]Test test)
        {    
            User user = null;

            if ((user = Users.Dispatchers.FirstOrDefault(disp => disp.UserName == test.username && disp.Password == test.password)) == null)
                if ((user = Users.Customers.FirstOrDefault(disp => disp.UserName == test.username && disp.Password == test.password)) == null)
                    user = Users.Drivers.FirstOrDefault(disp => disp.UserName == test.username && disp.Password == test.password);


            if (user == null)
            {
                return "Username or password are incorrect";
            }
            else
            {
                HttpContext.Current.Session["MyUser1"] = user;
                return user.Role.ToString();
            }   
        }

        // PUT: api/Login/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Login/5
        public void Delete(int id)
        {
        }
    }
}
