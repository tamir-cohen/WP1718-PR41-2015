using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public abstract class User
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public Gender Gender { get; set; }
        public string UPRN { get; set; }
        public string ContactNumber { get; set; }
        public string Email { get; set; }       
        public Roles Role { get; set; }
        public List<Drive> Drives { get; set; }
    }
}