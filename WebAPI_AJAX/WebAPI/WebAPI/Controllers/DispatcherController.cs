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
    public class DispatcherController : ApiController
    {
        // GET: api/Dispather/5
        public Dispatcher Get()
        {
            Dispatcher dispatcher = (Dispatcher)HttpContext.Current.Session["MyUser1"];

            return dispatcher;
        }

        [HttpGet]
        [Route("api/Dispatcher/GetAllDrives")]
        public List<Drive> GetAllDrives()
        {
            List<Drive> ret = new List<Drive>();
            foreach (var item in Users.Customers)
            {
                ret.AddRange(item.Drives);
            }

            foreach (var item in Users.Dispatchers)
            {
                foreach (var item1 in item.Drives)
                {
                    if (!ret.Contains(item1))
                    {
                        ret.Add(item1);
                    }
                }
            }

            return ret;
        }

        [HttpGet]
        [Route("api/Dispatcher/GetMyDrives")]
        public List<Drive> GetMyDrives(string username)
        {
            return Users.Dispatchers.First(d => d.UserName == username).Drives;
        }

        [HttpGet]
        [Route("api/Dispatcher/ProcessDrive/")]
        public void ProcessDrive(string driver, string username, string cust, string drive)
        {
            int driveid = int.Parse(drive);
            Users.Customers.First(c => c.UserName == cust).Drives.First(d => d.Id == driveid).Driver = driver;
            Users.Customers.First(c => c.UserName == cust).Drives.First(d => d.Id == driveid).Dispatcher = username;
            Users.Customers.First(c => c.UserName == cust).Drives.First(d => d.Id == driveid).DriveStatus = DriveStatus.Processed;
            Drive dr = Users.Customers.First(c => c.UserName == cust).Drives.First(d => d.Id == driveid);
            Users.Dispatchers.First(d => d.UserName == username).Drives.Add(dr);
            Users.Drivers.First(driv => driv.UserName == driver).Drives.Add(dr);
            Users.Drivers.First(driv => driv.UserName == driver).Available = false;
        }

        [HttpGet]
        [Route("api/Dispatcher/GetAvailableDrivers")]
        public List<Driver> GetAvailableDrivers()
        {
            return Users.Drivers.Where(d => d.Available).ToList();
        }

        [HttpGet]
        [Route("api/Dispatcher/GetClosestDrivers")]
        public List<Driver> GetClosestDrivers(string x1, string y1)
        {
            List<Driver> ret = new List<Driver>();
            ret = Users.Drivers;
            DriverComparer dc = new DriverComparer(x1, y1);
            ret.Sort(dc);
            return (ret.Where(d => d.Available).ToList().Count <= 5) ? ret.Where(d => d.Available).ToList() : ret.Where(d => d.Available).ToList().GetRange(0, 5);
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

        [HttpGet]
        [Route("api/Dispatcher/AddDispDrive/")]
        public void AddDispDrive(string address, string x, string y, int car, string driver, string username)
        {
            Dispatcher dispatcher = Users.Dispatchers.First(d => d.UserName == username);
            Location location = new Location() { Address = new Address() { Street=address}, X = x, Y = y };
            Drive drive = new Drive()
            {
                Driver = driver,
                Dispatcher = Users.Dispatchers.First(d => d.UserName == username).UserName,
                DateTime = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
                DriveStatus = DriveStatus.Created,
                TypeOfCar = (CarType)car,
                StartLocation = location
            };

            Users.Dispatchers.First(d => d.UserName == username).Drives.Add(drive);
            Users.Drivers.First(d => d.UserName == driver).Drives.Add(drive);
            Users.Drivers.First(d => d.UserName == driver).Available = false;
        }

        [HttpPost]
        [Route("api/Dispatcher/AddNewDriver/")]
        public HttpResponseMessage AddNewDriver([FromBody]Driver value)
        {
            value.Role = Roles.Driver;
            HttpResponseMessage message = new HttpResponseMessage();

            if ((Users.Dispatchers.FirstOrDefault(disp => disp.UserName == value.UserName)) == null)
                if (Users.Customers.FirstOrDefault(disp => disp.UserName == value.UserName) == null)
                    if (Users.Drivers.FirstOrDefault(disp => disp.UserName == value.UserName) == null)
                    {
                        Users.Drivers.Add(value);
                        message.StatusCode = HttpStatusCode.OK;
                        return message;
                    }

            message.StatusCode = HttpStatusCode.NotAcceptable;

            return message;
        }

        [HttpGet]
        [Route("api/Dispatcher/GetUsers")]
        public List<string> GetUsers()
        {
            List<string> ret = new List<string>();
            foreach (var item in Users.Customers)
            {
                ret.Add(String.Format($"{item.UserName}-{item.Role.ToString()}-{item.Banned}"));
            }
            foreach (var item in Users.Drivers)
            {
                ret.Add(String.Format($"{item.UserName}-{item.Role.ToString()}-{item.Banned}"));
            }

            return ret;
        }

        [HttpGet]
        [Route("api/Dispatcher/GetUserNameAndSurname/")]
        public string GetUserNameAndSurname(string username)
        {
            string ret = "";

            if(Users.Customers.FirstOrDefault(c => c.UserName == username) != null)
                ret = Users.Customers.FirstOrDefault(c => c.UserName == username).Name + "-" + Users.Customers.FirstOrDefault(c => c.UserName == username).Surname;
            else if(Users.Drivers.FirstOrDefault(c => c.UserName == username) != null)
                ret = Users.Drivers.FirstOrDefault(c => c.UserName == username).Name + "-" + Users.Drivers.FirstOrDefault(c => c.UserName == username).Surname;

            return ret;
        }

        [HttpGet]
        [Route("api/Dispatcher/BlockUser/")]
        public List<string> BlockUser(string username)
        {
            if(Users.Customers.FirstOrDefault(c => c.UserName == username) != null)
            {
                Users.Customers.First(c => c.UserName == username).Banned = !Users.Customers.First(c => c.UserName == username).Banned;
            }
            else
            {
                Users.Drivers.FirstOrDefault(c => c.UserName == username).Banned = !Users.Drivers.First(c => c.UserName == username).Banned;
                if (Users.Drivers.FirstOrDefault(c => c.UserName == username).Banned)
                    Users.Drivers.FirstOrDefault(c => c.UserName == username).Available = false;
            }

            return GetUsers();
        }

        [HttpPost]
        [Route("api/Dispatcher/GetLocation")]
        public Location GetLocation([FromBody]JObject json)
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

        [HttpGet]
        [Route("api/Dispatcher/GetDrivers")]
        public List<Driver> GetDrivers(string username, string drive)
        {
            int driveid = int.Parse(drive);
            string x1 = Users.Customers.FirstOrDefault(c => c.UserName == username).Drives.FirstOrDefault(d => d.Id == driveid).StartLocation.X;
            string y1 = Users.Customers.FirstOrDefault(c => c.UserName == username).Drives.FirstOrDefault(d => d.Id == driveid).StartLocation.Y;

            return GetClosestDrivers(x1, y1);
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

    public class DriverComparer : IComparer<Driver>
    {
        public DriverComparer(string x1, string y1)
        {
            this.x1 = x1;
            this.y1 = y1;
        }

        public string x1 { get; set; }
        public string y1 { get; set; }

        public int Compare(Driver d1, Driver d2)
        {
            double dist1 = GetAbsoluteDistance(d1.Location.X, x1, d1.Location.Y, y1);
            double dist2 = GetAbsoluteDistance(d2.Location.X, x1, d2.Location.Y, y1);

            return dist1.CompareTo(dist2);
        }

        public double GetAbsoluteDistance(string x, string x1, string y, string y1)
        {
            x = x.Replace(".", ",");
            x1 = x1.Replace(".", ",");
            y = y.Replace(".", ",");
            y1 = y1.Replace(".", ",");

            double dx = double.Parse(x);
            double dx1 = double.Parse(x1);
            double dy = double.Parse(y);
            double dy1 = double.Parse(y1);

            return Math.Sqrt(Math.Pow((dx - dx1), 2) + Math.Pow((dy - dy1), 2));
        }
    }
}
