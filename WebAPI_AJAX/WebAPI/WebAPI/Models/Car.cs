using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Car
    {
        public Driver Driver { get; set; }
        public int Age { get; set; }
        public string RegNumber { get; set; }
        public int TaxiId { get; set; }
        public CarType Type { get; set; }
    }
}