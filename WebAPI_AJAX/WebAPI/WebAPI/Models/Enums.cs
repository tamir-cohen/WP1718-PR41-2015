using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAPI.Models
{
    public enum Rate { NotRated = 0, _1, _2, _3, _4, _5 }
    public enum CarType { Unspecified, PassengerCar, Van }
    public enum DriveStatus { Created_Waiting, Created, Processed, Approved, Canceled, Failed, Successful }
    public enum Gender { Male, Female }
    public enum Roles { Admin, Driver, Customer }
}