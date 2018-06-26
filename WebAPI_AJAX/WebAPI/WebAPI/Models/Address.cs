using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Address
    {
        public string Street { get; set; }
        public string HomeNumber { get; set; }
        public string City { get; set; }
        public string PostCode { get; set; }
    }
}