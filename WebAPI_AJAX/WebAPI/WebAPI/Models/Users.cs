﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace WebAPI.Models
{
    public class Users
    {
        public Users(string path)
        {
            Drivers = new List<Driver>();
            Customers = new List<User>();
            Dispatchers = new List<Dispatcher>();

            Customers.Add(new Customer() { UserName = "musterija", Password = "musterija", Role = Roles.Customer });
            Customers.Add(new Customer() { UserName = "musterija1", Password = "musterija1", Role = Roles.Customer });
            Customers.Add(new Customer() { UserName = "musterija2", Password = "musterija2", Role = Roles.Customer });

            Drivers.Add(new Driver() { UserName = "driver", Password = "driver", Role = Roles.Driver });
            Drivers.Add(new Driver() { UserName = "driver1", Password = "driver1", Role = Roles.Driver });
            Drivers.Add(new Driver() { UserName = "driver2", Password = "driver2", Role = Roles.Driver });

            /*List<Dispatcher> dispatchers = new List<Dispatcher>()
            {
                new Dispatcher(){ UserName="admin", Password="admin", UPRN="1212988153886", ContactNumber="021/212-467", Email="admin@yahoo.com", Gender = Gender.Male, Name="Stefan", Surname="Stefanovic", Role = Roles.Admin, Drives = new List<Drive>() },
                new Dispatcher(){ UserName="admin1", Password="admin1", UPRN="1406990426111", ContactNumber="021/888-888", Email="admin1@yahoo.com", Gender = Gender.Male, Name="Petar", Surname="Petrovic", Role = Roles.Admin, Drives = new List<Drive>() },
                new Dispatcher(){ UserName="admin2", Password="admin2", UPRN="2810996123456", ContactNumber="021/123-456", Email="admin2@yahoo.com", Gender = Gender.Male, Name="Zivorad", Surname="Zivoradovic", Role = Roles.Admin, Drives = new List<Drive>() }
            };

            if (File.Exists(path))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Dispatcher>));
                using (StreamWriter writer = new StreamWriter(path, true))
                {
                    serializer.Serialize(writer, dispatchers);
                }
            }*/
            if (File.Exists(path))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Dispatcher>));
                using (StreamReader writer = new StreamReader(path))
                {
                    Dispatchers = (List<Dispatcher>)serializer.Deserialize(writer);
                }
            }
        }

        public static List<Dispatcher> Dispatchers { get; set; }
        public static List<User> Customers { get; set; }
        public static List<Driver> Drivers { get; set; }
    }
}