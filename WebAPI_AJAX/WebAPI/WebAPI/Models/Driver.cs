﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Driver : User
    {
        public Location Location { get; set; }
        public Car Car { get; set; }
    }
}