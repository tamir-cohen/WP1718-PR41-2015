using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Dispatcher : User
    {
        public Dispatcher()
        {
            this.Drives = new List<Drive>();
        }
    }
}