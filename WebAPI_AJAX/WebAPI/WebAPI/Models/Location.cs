﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Location
    {
        public string X { get; set; }
        public string Y { get; set; }
        public Address Address { get; set; }

        public Location()
        {
            Address = new Address();
        }
    }
}