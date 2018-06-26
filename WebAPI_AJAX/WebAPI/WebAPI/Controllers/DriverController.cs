using Newtonsoft.Json;
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
    public class DriverController : ApiController
    {
        public Driver Get()
        {
            Driver driver = (Driver)HttpContext.Current.Session["MyUser1"];

            return driver;
        }

        [HttpGet]
        [Route("api/Driver/GetAllDrives")]
        public List<Drive> GetAllDrives()
        {
            List<Drive> ret = new List<Drive>();
            foreach (var item in Users.Customers)
            {
                ret.AddRange(item.Drives.Where(d => d.DriveStatus == DriveStatus.Created_Waiting));
            }

            return ret;
        }

        [HttpGet]
        [Route("api/Driver/GetMyDrives")]
        public List<Drive> GetMyDrives(string username)
        {
            return Users.Drivers.First(d => d.UserName == username).Drives;
        }

        [HttpGet]
        [Route("api/Driver/TakeDrive/")]
        public void TakeDrive(string drive, string user)
        {
            int driveid = int.Parse(drive.Substring(1));

            Drive driveadd = null;
            foreach (var item in Users.Customers)
            {
                foreach (var item1 in item.Drives)
                {
                    if(item1.Id == driveid)
                    {
                        item1.Driver = user;
                        item1.DriveStatus = DriveStatus.Approved;
                        driveadd = item1;
                        break;
                    }
                }
            }

            Users.Drivers.First(d => d.UserName == user).Drives.Add(driveadd);
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

        [HttpPost]
        [Route("api/Driver/FinishDriveFail/")]
        public void FinishDriveFail([FromBody]Comment comment)
        {
            int driveid = int.Parse(comment.Drive.Substring(1));
            comment.DateTime = DateTime.Now;
            Users.Drivers.First(d => d.UserName == comment.User).Drives.First(d => d.Id == driveid).Comment = comment;
            Users.Drivers.First(d => d.UserName == comment.User).Drives.First(d => d.Id == driveid).DriveStatus = DriveStatus.Failed;
            Users.Drivers.First(d => d.UserName == comment.User).Available = true;
        }

        [HttpPost]
        [Route("api/Driver/FinishDriveSuccess/")]
        public void FinishDriveSuccess([FromBody]JObject jsonLocation)
        {
            string s = jsonLocation.ToString();
            IList<JToken> address_list = jsonLocation["jsonLocation"]["address"].Children().ToList();
            IList<JToken> coordinates = jsonLocation["jsonLocation"]["boundingbox"].Children().ToList();
            Location lok = new Location();
            lok.X = coordinates[0].ToString().Trim(new char[] { '{', '}' });
            lok.Y = coordinates[2].ToString().Trim(new char[] { '{', '}' });
            lok.Address = new Address();
            foreach (var item in address_list)
            {
                string temp = item.ToString();
                temp = temp.Replace("\"", "").Trim();
                if (temp.StartsWith("house_number"))
                    lok.Address.HomeNumber = temp.Split(':')[1].Trim();
                if(temp.StartsWith("road"))
                    lok.Address.Street = temp.Split(':')[1].Trim();
                if(temp.StartsWith("postcode"))
                    lok.Address.PostCode = temp.Split(':')[1].Trim();
                if(temp.StartsWith("city"))
                    lok.Address.City = temp.Split(':')[1].Trim();
            }
            string sprice = jsonLocation["price"].ToString();
            sprice = sprice.Replace("\"", "").Trim();
            string sdriveid = jsonLocation["drive"].ToString();
            sdriveid = sdriveid.Replace("\"", "").Trim();
            int driveprice = int.Parse(sprice);
            int driveid = int.Parse(sdriveid.Substring(1));
            string driver = Get().UserName;

            Users.Drivers.First(d => d.UserName == driver).Drives.First(dr => dr.Id == driveid).Price = driveprice;
            Users.Drivers.First(d => d.UserName == driver).Drives.First(dr => dr.Id == driveid).EndLocation = lok;
            Users.Drivers.First(d => d.UserName == driver).Drives.First(dr => dr.Id == driveid).DriveStatus = DriveStatus.Successful;
            Users.Drivers.First(d => d.UserName == driver).Available = true;
        }

        // PUT: api/Driver/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Driver/5
        public void Delete(int id)
        {
        }

        [HttpPost]
        [Route("api/Driver/SetLocation/")]
        public void SetLocation([FromBody]JObject json)
        {
            string s = json.ToString();

            IList<JToken> address_list = json["json"]["address"].Children().ToList();
            IList<JToken> coordinates = json["json"]["boundingbox"].Children().ToList();
            Location lok = new Location();
            lok.X = coordinates[0].ToString().Trim(new char[] { '{', '}' });
            lok.Y = coordinates[2].ToString().Trim(new char[] { '{', '}' });
            lok.Address = new Address();
            foreach (var item in address_list)
            {
                string temp = item.ToString();
                temp = temp.Replace("\"", "").Trim();
                lok.Address.HomeNumber = temp.StartsWith("home_number") ? temp.Split(':')[1].Trim() : "bb";
                lok.Address.Street = temp.StartsWith("road") ? temp.Split(':')[1].Trim() : "-";
                lok.Address.PostCode = temp.StartsWith("postcode") ? temp.Split(':')[1].Trim() : "-";
                lok.Address.City = temp.StartsWith("city") ? temp.Split(':')[1].Trim() : "-";
            }
            string username = Get().UserName;
            Users.Drivers.First(d => d.UserName == username).Location = lok;
        }
    }
}
