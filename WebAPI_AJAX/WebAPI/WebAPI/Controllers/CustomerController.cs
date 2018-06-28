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
        [MyAuthorization(Roles = "Customer")]
        public List<Drive> Get(string username) {
            List<Drive> drives = Users.Customers.FirstOrDefault(cust => cust.UserName == username).Drives;
            return drives;
        }

        [MyAuthorization(Roles = "Customer")]
        [HttpGet]
        [Route("api/Customer/GetDrive/")]
        public Drive GetDrive(string driveid, string username)
        {
            int driveToChange = -1;
            driveToChange = int.Parse(driveid.Substring(1));
            Drive drive = Users.Customers.FirstOrDefault(cust => cust.UserName == username).Drives.First(d => d.Id == driveToChange);
            return drive;
        }

        [MyAuthorization(Roles = "Customer")]
        public Customer Get()
        {
            Customer customer = (Customer)HttpContext.Current.Session["MyUser1"];
            return customer;
        }

        [MyAuthorization(Roles = "Customer")]
        [HttpPost]
        [Route("api/Customer/CreateDrive")]
        public void CreateDrive([FromBody]JObject json)
        {
            if (json != null)
            {
                string customer = Get().UserName;
                Customer username = Users.Customers.FirstOrDefault(cust => cust.UserName == customer);
                string s = json.ToString();
                IList<JToken> address_list = json["json"]["address"].Children().ToList();
                Location lok = new Location();
                lok.X = json["json"]["lon"].ToString().Trim(new char[] { '{', '}' });
                lok.Y = json["json"]["lat"].ToString().Trim(new char[] { '{', '}' });
                lok.Address = new Address();
                foreach (var item in address_list)
                {
                    string temp = item.ToString();
                    temp = temp.Replace("\"", "").Trim();
                    if (temp.StartsWith("house_number"))
                        lok.Address.HomeNumber = temp.Split(':')[1].Trim();
                    if (temp.StartsWith("road"))
                        lok.Address.Street = temp.Split(':')[1].Trim();
                    if (temp.StartsWith("postcode"))
                        lok.Address.PostCode = temp.Split(':')[1].Trim();
                    if (temp.StartsWith("city"))
                        lok.Address.City = temp.Split(':')[1].Trim();
                }
                int car = int.Parse(json["car_type"].ToString());

                Drive drive = new Drive()
                {
                    Customer = customer,
                    DateTime = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
                    DriveStatus = DriveStatus.Created_Waiting,
                    TypeOfCar = (CarType)car,
                    StartLocation = lok
                };

                username.Drives.Add(drive);

                HttpContext.Current.Session["MyUser1"] = username;
                Users.WriteToFile();
            }
        }

        // POST: api/Customer
        [MyAuthorization(Roles = "Customer")]
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
            Users.WriteToFile();
            return message;
        }

        [MyAuthorization(Roles = "Customer")]
        [HttpGet]
        [Route("api/Customer/RemoveDrive/")]
        public void RemoveDrive(string driveid, string username)
        {
            int driveToRemove = int.Parse(driveid);

            User user = Users.Customers.First(cust => cust.UserName == username);
            int index = user.Drives.IndexOf(user.Drives.First(d => d.Id == driveToRemove));
            Users.Customers.First(cust => cust.UserName == username).Drives[index].DriveStatus = DriveStatus.Canceled;
            Users.WriteToFile();
        }

        [MyAuthorization(Roles = "Customer")]
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
            Users.WriteToFile();
        }

        [MyAuthorization(Roles = "Customer")]
        [HttpPost]
        [Route("api/Customer/PostComment/")]
        public void PostComment([FromBody]Comment comment)
        {
            int driveid = int.Parse(comment.Drive);
            Users.Customers.First(c => c.UserName == comment.User).Drives.First(d => d.Id == driveid).Comment = comment;
            Users.WriteToFile();
        }

        [MyAuthorization(Roles = "Customer")]
        [HttpPost]
        [Route("api/Customer/GetLocation")]
        public Location GetLocation([FromBody]JObject json)
        {
            if (json != null)
            {
                string s = json.ToString();
                IList<JToken> address_list = json["json"]["address"].Children().ToList();
                Location lok = new Location();
                lok.X = json["json"]["lon"].ToString().Trim(new char[] { '{', '}' });
                lok.Y = json["json"]["lat"].ToString().Trim(new char[] { '{', '}' });
                lok.Address = new Address();
                foreach (var item in address_list)
                {
                    string temp = item.ToString();
                    temp = temp.Replace("\"", "").Trim();
                    if (temp.StartsWith("house_number"))
                        lok.Address.HomeNumber = temp.Split(':')[1].Trim();
                    if (temp.StartsWith("road"))
                        lok.Address.Street = temp.Split(':')[1].Trim();
                    if (temp.StartsWith("postcode"))
                        lok.Address.PostCode = temp.Split(':')[1].Trim();
                    if (temp.StartsWith("city"))
                        lok.Address.City = temp.Split(':')[1].Trim();
                }
                return lok;
            }
            return null;
        }

        // PUT: api/Customer/5
        [MyAuthorization(Roles = "Customer")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Customer/5
        [MyAuthorization(Roles = "Customer")]
        public void Delete(int id)
        {
        }
    }
}
