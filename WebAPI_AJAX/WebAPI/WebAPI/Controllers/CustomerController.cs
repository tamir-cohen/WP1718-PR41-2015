using Newtonsoft.Json.Linq;
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
    public class CustomerController : ApiController
    {
        public List<Drive> Get(string username) {
            List<Drive> drives = Users.Customers.FirstOrDefault(cust => cust.UserName == username).Drives;
            return drives;
        }

        [HttpGet]
        [Route("api/Customer/GetDrive/")]
        public Drive GetDrive(string driveid, string username)
        {
            int driveToChange = -1;
            driveToChange = int.Parse(driveid.Substring(1));
            Drive drive = Users.Customers.FirstOrDefault(cust => cust.UserName == username).Drives.First(d => d.Id == driveToChange);
            return drive;
        }

        public Customer Get()
        {
            Customer customer = (Customer)HttpContext.Current.Session["MyUser1"];
            return customer;
        }

        public void Get(string address, string x, string y, int car, string customer)
        {
            HttpResponseMessage message = new HttpResponseMessage();
            Customer temp = (Customer)Users.Customers.FirstOrDefault(cust => cust.UserName == customer);
            Location location = new Location() { Address = new Address() { Street=address}, X = x, Y = y };
            Drive drive = new Drive() {
                Customer = temp.UserName,
                DateTime = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
                DriveStatus = DriveStatus.Created_Waiting,
                TypeOfCar = (CarType)car,
                StartLocation = location
            };

            temp.Drives.Add(drive);

            HttpContext.Current.Session["MyUser1"] = temp;
        }

        // POST: api/Customer
        public HttpResponseMessage Post([FromBody]Customer value)
        {
            value.Role = Roles.Customer;
            HttpResponseMessage message = new HttpResponseMessage();

            if ((Users.Customers.FirstOrDefault(disp => disp.UserName == value.UserName)) != null)
            {
                int index = Users.Customers.IndexOf(Users.Customers.FirstOrDefault(disp => disp.UserName == value.UserName));
                value.Drives = Users.Customers[index].Drives;
                Users.Customers[index] = value;
                HttpContext.Current.Session["MyUser1"] = value;
                message.StatusCode = HttpStatusCode.OK;
                return message;
            }

            message.StatusCode = HttpStatusCode.NotAcceptable;

            return message;
        }

        [HttpGet]
        [Route("api/Customer/RemoveDrive/")]
        public void RemoveDrive(string driveid, string username)
        {
            int driveToRemove = int.Parse(driveid);

            User user = Users.Customers.First(cust => cust.UserName == username);
            int index = user.Drives.IndexOf(user.Drives.First(d => d.Id == driveToRemove));
            Users.Customers.First(cust => cust.UserName == username).Drives[index].DriveStatus = DriveStatus.Canceled;
        }

        [HttpGet]
        [Route("api/Customer/ChangeDrive/")]
        public void ChangeDrive(int driveid, string address, string x, string y, int car, string username)
        {
            Drive drive = Users.Customers.First(cust => cust.UserName == username).Drives.First(d => d.Id == driveid);
            int index = Users.Customers.First(cust => cust.UserName == username).Drives.IndexOf(drive);
            Users.Customers.First(cust => cust.UserName == username).Drives[index].StartLocation.Address = new Address() { Street=address};
            Users.Customers.First(cust => cust.UserName == username).Drives[index].StartLocation.X = x;
            Users.Customers.First(cust => cust.UserName == username).Drives[index].StartLocation.Y = y;
            Users.Customers.First(cust => cust.UserName == username).Drives[index].TypeOfCar = (CarType)car;
        }

        [HttpPost]
        [Route("api/Customer/PostComment/")]
        public void PostComment([FromBody]Comment comment)
        {
            int driveid = int.Parse(comment.Drive);
            Users.Customers.First(c => c.UserName == comment.User).Drives.First(d => d.Id == driveid).Comment = comment;
        }

        // PUT: api/Customer/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Customer/5
        public void Delete(int id)
        {
        }
    }
}
