using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace WebAPI.Models
{
    public class Users
    {
        public static string PathA { get; set; }
        public static string PathC { get; set; }
        public static string PathD { get; set; }
        public Users(string pathA, string pathC, string pathD)
        {
            Drivers = new List<Driver>();
            Customers = new List<Customer>();
            Dispatchers = new List<Dispatcher>();

            PathA = pathA;
            PathC = pathC;
            PathD = pathD;

            LoadTestData();

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

            /*if (File.Exists(pathC))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Customer>));
                using (StreamWriter writer = new StreamWriter(pathC, true))
                {
                    serializer.Serialize(writer, Customers);
                }
            }

            if (File.Exists(pathD))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Driver>));
                using (StreamWriter writer = new StreamWriter(pathD, true))
                {
                    serializer.Serialize(writer, Drivers);
                }
            }*/
        }

        public static void WriteToFile()
        {
            if (File.Exists(PathA))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Dispatcher>));
                using (StreamWriter writer = new StreamWriter(PathA))
                {
                    serializer.Serialize(writer, Dispatchers);
                }
            }

            if (File.Exists(PathC))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Customer>));
                using (StreamWriter writer = new StreamWriter(PathC))
                {
                    serializer.Serialize(writer, Customers);
                }
            }

            if (File.Exists(PathD))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Driver>));
                using (StreamWriter writer = new StreamWriter(PathD))
                {
                    serializer.Serialize(writer, Drivers);
                }
            }
        }

        private void LoadTestData()
        {
            if (File.Exists(PathA))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Dispatcher>));
                using (StreamReader writer = new StreamReader(PathA))
                {
                    Dispatchers = (List<Dispatcher>)serializer.Deserialize(writer);
                }
            }
            if (File.Exists(PathC))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Customer>));
                using (StreamReader writer = new StreamReader(PathC))
                {
                    Customers = (List<Customer>)serializer.Deserialize(writer);
                }
            }
            if (File.Exists(PathD))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(List<Driver>));
                using (StreamReader writer = new StreamReader(PathD))
                {
                    Drivers = (List<Driver>)serializer.Deserialize(writer);
                }
            }

            /*Customers.Add(new Customer() { UserName = "customer", Password = "customer", Role = Roles.Customer, Gender = Gender.Male, Name = "Janko", Surname = "Jankovic", ContactNumber = "021/428-010", Email = "cust@gmail.com", UPRN = "5648923157562" });
            Customers.Add(new Customer() { UserName = "customer1", Password = "customer1", Role = Roles.Customer, Gender = Gender.Female, Name = "Marija", Surname = "Markovic", ContactNumber = "064/825-110", Email = "marijam@uns.ac.rs", UPRN = "5648723014987" });
            Customers.Add(new Customer() { UserName = "customer2", Password = "customer2", Role = Roles.Customer, Gender = Gender.Female, Name = "Ana", Surname = "Mitrovic", ContactNumber = "062/188-424", Email = "anam@yahoo.com", UPRN = "0224988652145" });

            Drivers.Add(new Driver() { UserName = "driver", Password = "driver", Role = Roles.Driver, Location = new Location() { Address = new Address() { Street = "spens" }, X = "19.842747450238672", Y = "45.24866182125004" }, Name="Jovan", Surname="Cvijic", ContactNumber="064/888-111", Email="jovanc@gmail.com", Gender = Gender.Male, UPRN = "2516512315161" });
            Drivers.Add(new Driver() { UserName = "driver1", Password = "driver1", Role = Roles.Driver, Location = new Location() { Address = new Address() { Street = "futoska" }, X = "19.83619093894958", Y = "45.25161272572694" }, Name = "Dragana", Surname = "Cvijic", ContactNumber = "064/888-111", Email = "draganac@gmail.com", Gender = Gender.Female, UPRN = "259562626156" });
            Drivers.Add(new Driver() { UserName = "driver2", Password = "driver2", Role = Roles.Driver, Location = new Location() { Address = new Address() { Street = "sajmiste" }, X = "19.82398152351379", Y = "45.25387859375334" }, Name = "Milutin", Surname = "Milankovic", ContactNumber = "064/888-111", Email = "milutinm@hotmail.com", Gender = Gender.Male, UPRN = "251651654156116" });
            Drivers.Add(new Driver() { UserName = "driver3", Password = "driver3", Role = Roles.Driver, Location = new Location() { Address = new Address() { Street = "sajmiste" }, X = "19.82398152351379", Y = "45.25387859375334" }, Name = "Fedor", Surname = "Smolov", ContactNumber = "064/822-1-880", Email = "fedor@yandex.com", Gender = Gender.Male, UPRN = "1251152151515" });
            Drivers.Add(new Driver() { UserName = "driver4", Password = "driver4", Role = Roles.Driver, Location = new Location() { Address = new Address() { Street = "centar" }, X = "19.846954643726345", Y = "45.254252453288956" }, Name = "Filip", Surname = "Filipovic", ContactNumber = "064/888-222", Email = "filipf@gmail.com", Gender = Gender.Male, UPRN = "251651231485" });
            Drivers.Add(new Driver() { UserName = "driver5", Password = "driver5", Role = Roles.Driver, Location = new Location() { Address = new Address() { Street = "centar" }, X = "19.846954643726345", Y = "45.254252453288956" }, Name = "Jadranka", Surname = "Jasic", ContactNumber = "064/822-111", Email = "jadran@gmail.com", Gender = Gender.Female, UPRN = "25165402125625" });

            Drivers[0].Car = new Car() { Age = 1999, Driver = Drivers[0].UserName, RegNumber = "T55-A-623", TaxiId = 1, Type = CarType.PassengerCar };
            Drivers[1].Car = new Car() { Age = 2004, Driver = Drivers[1].UserName, RegNumber = "T88-K-456", TaxiId = 2, Type = CarType.PassengerCar };
            Drivers[2].Car = new Car() { Age = 2010, Driver = Drivers[2].UserName, RegNumber = "T56-A-123", TaxiId = 3, Type = CarType.PassengerCar };
            Drivers[3].Car = new Car() { Age = 2002, Driver = Drivers[3].UserName, RegNumber = "T58-L-220", TaxiId = 4, Type = CarType.Van };
            Drivers[4].Car = new Car() { Age = 2012, Driver = Drivers[4].UserName, RegNumber = "T22-R-012", TaxiId = 5, Type = CarType.Van };
            Drivers[5].Car = new Car() { Age = 2008, Driver = Drivers[5].UserName, RegNumber = "T92-J-600", TaxiId = 6, Type = CarType.PassengerCar };*/
        }

        public static List<Dispatcher> Dispatchers { get; set; }
        public static List<Customer> Customers { get; set; }
        public static List<Driver> Drivers { get; set; }
    }
}