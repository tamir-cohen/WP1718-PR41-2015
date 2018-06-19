using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Customer : User
    {
        public Customer()
        {
            Drives = new List<Drive>();
        }
    }
}