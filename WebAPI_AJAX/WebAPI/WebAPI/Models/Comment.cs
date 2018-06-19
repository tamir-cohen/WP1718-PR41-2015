using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public class Comment
    {
        public string Description { get; set; }
        public DateTime DateTime { get; set; }
        public string User { get; set; }
        public string Drive { get; set; }
        public Rate Rate { get; set; }
    }
}