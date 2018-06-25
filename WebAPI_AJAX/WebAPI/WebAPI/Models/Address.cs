using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Address
    {
        public string house_number { get; set; }
        public string road { get; set; }
        public string neighbourhood { get; set; }
        public string city { get; set; }
        public string county { get; set; }
        public string state { get; set; }
        public string postcode { get; set; }
        public string country { get; set; }
        public string country_code { get; set; }

        public Address()
        {

        }
    }
}