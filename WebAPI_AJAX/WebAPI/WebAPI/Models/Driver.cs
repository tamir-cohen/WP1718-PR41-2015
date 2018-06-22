using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Driver : User
    {
        public Location Location { get; set; }
        public Car Car { get; set; }
        public bool Available { get; set; }

        public Driver()
        {
            Location = new Location();
            Available = true;
            Car = new Car();
            this.Drives = new List<Drive>();
        }
    }
}