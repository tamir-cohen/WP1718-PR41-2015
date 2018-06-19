using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Drive
    {
        private static int UniqueId = 0;
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public Location StartLocation { get; set; }
        public CarType TypeOfCar { get; set; }
        public string Customer { get; set; }
        public Location EndLocation { get; set; }
        public string Dispatcher { get; set; }
        public string Driver { get; set; }
        public double Price { get; set; }
        public Comment Comment { get; set; }
        public DriveStatus DriveStatus { get; set; }

        public Drive()
        {
            Id = UniqueId;
            UniqueId++;
        }
    }
}