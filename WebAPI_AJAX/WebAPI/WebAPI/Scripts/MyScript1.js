let writeNewDrive = function (user) {
    let html;
    if (user.Role == 0) {
        html = `Dispather`;
    } else if (user.Role == 1) {
        html = `Driver`;
    } else {
        html = `Customer`;
    }
    ShowMap("#divwriteuserdata");
    $("#divwriteuserdata").append(`<table class="table table - bordered" style="float:right;width:50%;padding:200px 0px 200px 0px;">
        <thead>
        <tr class="success">
            <th colspan="2">
                Create new drive
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Your current address:</td>
            <td>
                <input type="text" id="txtAddress"/>
            </td>
        </tr>
        <tr>
            <td>Coordinates:</td>
            <td>
                <input type="text" id="txtX"/>
                <input type="text" id="txtY"/>
            </td>
        </tr>
        <tr>
            <td>Type of car(not needed):</td>
            <td>
                <select id="cmbCar">
                    <option value="0">Default</option>
                    <option value="1">Passenger car</option>
                    <option value="2">Van</option>
                </select>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnCreate" class="btn btn-primary" type="button" value="Create"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnCreate").click(function () {
        var car1 = $("#cmbCar").val();

        $.post("/api/Customer/CreateDrive/", { json: jsonobj, car_type: car1 }, function () {
            location.href = `Customer.html`;
        })
            .fail(function () {
                alert(`error while sending address`);
            });
    });

    $("#btnSubmitLoc").click(function () {
        alert(jsonobj);
        $.post("/api/Customer/GetLocation/", { json: jsonobj }, function (location) {
            $("#txtAddress").val(location.Address.Street + location.Address.HomeNumber);
            $("#txtX").val(location.X);
            $("#txtY").val(location.Y);
        })
            .fail(function () {
                alert(`error while sending location`);
            });
    });
};

let writeUserDrives = function (data) {
    let temp = ``;
    for (drive in data) {
        temp += `<tr>`;
        temp += (`<td>${data[drive].DateTime}</td>`);
        temp += (`<td>${(data[drive].Customer == null) ? `-` : data[drive].Customer}</td>`);
        temp += (`<td>${(data[drive].Dispatcher == null) ? `-` : data[drive].Dispatcher}</td>`);
        temp += (`<td>${(data[drive].Driver == null) ? `-` : data[drive].Driver}</td>`);
        temp += (`<td class="col1">${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${carTypeToString(data[drive].TypeOfCar)}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? `-` : (data[drive].StartLocation.Address.Street + " " + data[drive].StartLocation.Address.HomeNumber + " " + data[drive].StartLocation.Address.City + " " + data[drive].StartLocation.Address.PostCode)}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? `-` : (data[drive].EndLocation.Address.Street + " " + data[drive].EndLocation.Address.HomeNumber + " " + data[drive].EndLocation.Address.City + " " + data[drive].EndLocation.Address.PostCode)}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Description}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `0` : data[drive].Comment.Rate}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="${data[drive].Id}" name="Remove" class="btn btn-primary" type="button" value="Cancel"/><input id="C${data[drive].Id}" name="Change" class="btn btn-primary" type="button" value="Edit"/></td>` : ``);
        temp += ((data[drive].DriveStatus == `6`) ? `<td><input id="${data[drive].Id}" name="AddComment" class="btn btn-primary" type="button" value="Add comment"/>` : ``);
        temp += `</tr>`;
    };

    $("#divwriteuserdata").html(`<table id="table" class="table table-bordered">
        <thead>
        <tr class="success">
            <th colspan="11" style="text-align:center">
                User drives
             </th>
        </tr>
        <tr class="success">    
            <th name="sort" style="cursor:pointer">Date & time<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>Customer</th>
            <th>Dispatcher</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Car type</th>
            <th>Start location</th>
            <th>End location</th>
            <th name="sort" style="cursor:pointer">Price<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>Comment</th>
            <th name="sort" style="cursor:pointer">Rate<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
        </tr>
        </thead>
        <tbody>${temp}        
        </tbody>
    </table>
    <table class= "table table-bordered">
    <thead>
        <tr class="danger"><th>Search by date</th><th>Search by price</th><th>Search by rate</th></tr>
    </thead>
    <tbody>
        <tr class="warning">
            <td><b>From: <input type="datetime-local" id="startdatetime" /></br>To: &nbsp&nbsp&nbsp&nbsp&nbsp<input type="datetime-local" id="enddatetime" /></b></td>
            <td><b>From: <input type="number" id="startprice" /></br>To: &nbsp&nbsp&nbsp&nbsp&nbsp<input type="number" id="endprice" /></b></td>
            <td><b>From: <input type="number" id="startrate" /></br>To: &nbsp&nbsp&nbsp&nbsp&nbsp<input type="number" id="endrate" /></b></td >
        </tr>
        <tr class="warning">
            <td colspan="3"><b>Filter by drive status: 
            <select id="cmbFilter">
                <option value="All">All</option>
                <option value="Created & Waiting">Created & Waiting</option>
                <option value="Created">Created</option>
                <option value="Processed">Processed</option>
                <option value="Taken">Taken</option>
                <option value="Canceled">Canceled</option>
                <option value="Failed">Failed</option>
                <option value="Successful">Successful</option>
            </select></b></td>
        </tr>
    </tbody>
    </table>
    <div>
        
    </div>`);

    $("#startdatetime").change(function () {
        display($("#startdatetime"), $("#enddatetime"));
    });

    $("#startrate").keyup(function () {
        if ($("#endrate").val() != ``) {
            if ($(this).val() - $("#endrate").val() > 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($(this).val(), $("#endrate").val(), 10);
            }
        } else {
            searchByPrice($(this).val(), $("#endrate").val(), 10);
        }
    });

    $("#endrate").keyup(function () {
        if ($("#startrate").val() != ``) {
            if ($(this).val() - $("#startrate").val() < 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($("#startrate").val(), $(this).val(), 10);
            }
        } else {
            searchByPrice($("#startrate").val(), $(this).val(), 10);
        }
    });

    $("#startprice").keyup(function () {
        if ($("#endprice").val() != ``) {
            if ($(this).val() - $("#endprice").val() > 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($(this).val(), $("#endprice").val(), 8);
            }
        } else {
            searchByPrice($(this).val(), $("#endprice").val(), 8);
        }
    });

    $("#endprice").keyup(function () {
        if ($("#startprice").val() != ``) {
            if ($(this).val() - $("#startprice").val() < 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($("#startprice").val(), $(this).val(), 8);
            }
        } else {
            searchByPrice($("#startprice").val(), $(this).val(), 8);
        }
    });

    $("th[name=sort]").click(function () {
        if ($(this.getElementsByTagName("span")).attr(`class`) == "glyphicon glyphicon-arrow-down") {
            $(this.getElementsByTagName("span")).removeClass("glyphicon glyphicon-arrow-down");
            $(this.getElementsByTagName("span")).toggleClass("glyphicon glyphicon-arrow-up");
        }
        else {
            $(this.getElementsByTagName("span")).removeClass("glyphicon glyphicon-arrow-up");
            $(this.getElementsByTagName("span")).toggleClass("glyphicon glyphicon-arrow-down");
        }
        var table = $(this).parents('table').eq(0)
        var rows = table.find('tr:gt(1)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc) { rows = rows.reverse() }
        for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
    });

    $('#cmbFilter').change(function () {
        if ($(this).val() == `All`) {
            $("#table td.col1").parent().show();
        } else {
            $("#table td.col1:contains('" + $(this).val() + "')").parent().show();
            $("#table td.col1:not(:contains('" + $(this).val() + "'))").parent().hide();
        }
    });

    $("input:button[name=Remove]").click(function () {
        writeCommentInput(this.id, data[0].Customer);
    });

    $("input:button[name=Change]").click(function () {
        let drive = null;
        $.get("/api/Customer/GetDrive/", { driveid: this.id, username: data[0].Customer }, function (data1) {
            drive = data1;
            writeChangeDrive(drive);
        }).fail(function () {
            alert(`error`);
            });
    });

    $("input:button[name=AddComment]").click(function () {
        addComment(this.id, data[0].Customer);
    });
};

let writeChangeDrive = function (drive) {
    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="2">
                Change drive data
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Your current address:</td>
            <td>
                <input type="text" id="txtAddress" value="${(drive.StartLocation.Address == null) ? `` : drive.StartLocation.Address}"/>
            </td>
        </tr>
        <tr>
            <td>Coordinates:</td>
            <td>
                <input type="text" id="txtX" value="${(drive.StartLocation.X == null) ? `` : drive.StartLocation.X}"/>
                <input type="text" id="txtY" value="${(drive.StartLocation.Y == null) ? `` : drive.StartLocation.Y}"/>
            </td>
        <tr>
            <td>Type of car(not needed):</td>
            <td>
                <select id="cmbCar">
                    <option value="0"${(drive.TypeOfCar == 0) ? ` selected` : ``}>Unspecified</option>
                    <option value="1"${(drive.TypeOfCar == 1) ? ` selected` : ``}>Passenger car</option>
                    <option value="2"${(drive.TypeOfCar == 2) ? ` selected` : ``}>Van</option>
                </select>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnChange" class="btn btn-primary" type="button" value="Save Changes"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnChange").click(function () {
        var address1 = $("#txtAddress").val();
        var x1 = $("#txtX").val();
        var y1 = $("#txtY").val();
        var car1 = $("#cmbCar").val();

        $.get("/api/Customer/ChangeDrive/", { driveid: drive.Id, address: address1, x: x1, y: y1, car: car1, username: drive.Customer }, function (data) {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = "Customer.html";
        })
            .fail(function () {
                alert(`error`);
            });
    });
};

let writeCommentInput = function (driveid, username) {
    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="2">
                Please leave a comment
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Rate this drive:</td>
            <td>
                <select id="cmbRate">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Description:</td>
            <td>
                <textarea rows="3" cols="50" id="txtDesc"></textarea>
            </td>
        <tr class="success">
                <td colspan="2">
                    <input id="btnSendComment" class="btn btn-primary" type="button" value="Post comment"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnSendComment").click(function () {
        var desc = $("#txtDesc").val();
        var rating = $("#cmbRate").val();

        $.post("/api/Customer/PostComment/", { drive: driveid, description: desc, user: username, rate: rating }, function () {
        }).done(function () {
            alert(`Changes successfully saved`);
            $.get("/api/Customer/RemoveDrive/", { driveid: driveid, username: username }, function () {
                alert(`Drive canceled`);
                location.href = "Customer.html";
            });
        })
            .fail(function () {
                alert(`error`);
            });
    });
};

let writeDispDrives = function (data, user) {
    let temp = ``;
    for (drive in data) {
        var custname = ``;
        var custsurname = ``;
        var drivname = ``;
        var drivsurname = ``;
        $.ajax({
            url: "/api/Dispatcher/GetUserNameAndSurname/",
            type: "get",
            async: false,
            data: { username: data[drive].Customer },
            success: function (response) {
                custname = response.split(`-`)[0];
                custsurname = response.split(`-`)[1];
            }
        });
        $.ajax({
            url: "/api/Dispatcher/GetUserNameAndSurname/",
            type: "get",
            async: false,
            data: { username: data[drive].Driver },
            success: function (response1) {
                drivname = response1.split(`-`)[0];
                drivsurname = response1.split(`-`)[1];
            }
        });

        temp += `<tr>`;
        temp += (`<td>${data[drive].DateTime}</td>`);
        temp += (`<td>${(data[drive].Customer == null) ? `-` : data[drive].Customer}</td>`);
        temp += (`<td>${(data[drive].Customer == null) ? `-` : custname}</td>`);
        temp += (`<td>${(data[drive].Customer == null) ? `-` : custsurname}</td>`);
        temp += (`<td>${(data[drive].Dispatcher == null) ? `-` : data[drive].Dispatcher}</td>`);
        temp += (`<td>${(data[drive].Driver == null) ? `-` : data[drive].Driver}</td>`);
        temp += (`<td>${(data[drive].Driver == null) ? `-` : drivname}</td>`);
        temp += (`<td>${(data[drive].Driver == null) ? `-` : drivsurname}</td>`);
        temp += (`<td class="col1">${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${carTypeToString(data[drive].TypeOfCar)}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? `-` : (data[drive].StartLocation.Address.Street + " " + data[drive].StartLocation.Address.HomeNumber + " " + data[drive].StartLocation.Address.City + " " + data[drive].StartLocation.Address.PostCode)}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? `-` : (data[drive].EndLocation.Address.Street + " " + data[drive].EndLocation.Address.HomeNumber + " " + data[drive].EndLocation.Address.City + " " + data[drive].EndLocation.Address.PostCode)}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Description}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `0` : data[drive].Comment.Rate}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="${data[drive].Id}" name="Process" class="btn btn-primary" type="button" value="Process drive"/>` : ``);
        temp += `</tr>`;
    }

    $("#divwriteuserdata").html(`<table id="table" class="table table-bordered">
        <thead>
        <tr class="success">
            <th colspan="11" style="text-align:center">
                All drives in system
            </th>
        </tr>
        <tr class="success">    
            <th name="sort" style="cursor:pointer">Date & time<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>Customer username</th>
            <th>Customer name</th>
            <th>Customer surname</th>
            <th>Dispatcher</th>
            <th>Driver username</th>
            <th>Driver name</th>
            <th>Driver surname</th>
            <th>Status</th>
            <th>Car type</th>
            <th>Start location</th>
            <th>End location</th>
            <th name="sort" style="cursor:pointer">Price<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>Comment</th>
            <th name="sort" style="cursor:pointer">Rate<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
        </tr>
        </thead>
        <tbody>${temp}        
        </tbody>
    </table>
    <table class= "table table-bordered">
    <thead>
        <tr class="danger"><th>Search by date</th><th>Search by price</th><th>Search by rate</th></tr>
    </thead>
    <tbody>
        <tr class="warning">
            <td><b>From: <input type="datetime-local" id="startdatetime" /></br>To: &nbsp&nbsp&nbsp&nbsp&nbsp<input type="datetime-local" id="enddatetime" /></b></td>
            <td><b>From: <input type="number" id="startprice" /></br>To: &nbsp&nbsp&nbsp&nbsp&nbsp<input type="number" id="endprice" /></b></td>
            <td><b>From: <input type="number" id="startrate" /></br>To: &nbsp&nbsp&nbsp&nbsp&nbsp<input type="number" id="endrate" /></b></td >
        </tr>
        <tr class="warning">
            <td colspan="3"><b>Filter by drive status: 
            <select id="cmbFilter">
                <option value="All">All</option>
                <option value="Created & Waiting">Created & Waiting</option>
                <option value="Created">Created</option>
                <option value="Processed">Processed</option>
                <option value="Taken">Taken</option>
                <option value="Canceled">Canceled</option>
                <option value="Failed">Failed</option>
                <option value="Successful">Successful</option>
            </select></b></td>
        </tr>
    </tbody>
    </table>
    <div>
        Search drives by Driver name/surname:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <input id="srcD" type="text"/><br/>
        Search drives by Customer name/surname: <input id="srcC" type="text"/> 
    </div>`);

    $("#srcD").keyup(function () {
        var value = $(this).val().toLowerCase();
        $("#table tbody tr").each(function () {
            var rowName = $(this).find('td:eq(6)').text().toLowerCase();
            var rowSurName = $(this).find('td:eq(7)').text().toLowerCase();
            if ((rowName.indexOf(value) > -1) || (rowSurName.indexOf(value) > -1)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $("#srcC").keyup(function () {
        var value = $(this).val().toLowerCase();
        $("#table tbody tr").each(function () {
            var rowName = $(this).find('td:eq(2)').text().toLowerCase();
            var rowSurName = $(this).find('td:eq(3)').text().toLowerCase();
            if ((rowName.indexOf(value) > -1) || (rowSurName.indexOf(value) > -1)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    $("#startdatetime").change(function () {
        display($("#startdatetime"), $("#enddatetime"));
    });

    $("#startrate").keyup(function () {
        if ($("#endrate").val() != ``) {
            if ($(this).val() - $("#endrate").val() > 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($(this).val(), $("#endrate").val(), 14);
            }
        } else {
            searchByPrice($(this).val(), $("#endrate").val(), 14);
        }
    });

    $("#endrate").keyup(function () {
        if ($("#startrate").val() != ``) {
            if ($(this).val() - $("#startrate").val() < 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($("#startrate").val(), $(this).val(), 14);
            }
        } else {
            searchByPrice($("#startrate").val(), $(this).val(), 14);
        }
    });

    $("#startprice").keyup(function () {
        if ($("#endprice").val() != ``) {
            if ($(this).val() - $("#endprice").val() > 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($(this).val(), $("#endprice").val(), 12);
            }
        } else {
            searchByPrice($(this).val(), $("#endprice").val(), 12);
        }
    });

    $("#endprice").keyup(function () {
        if ($("#startprice").val() != ``) {
            if ($(this).val() - $("#startprice").val() < 0) {
                alert(`Interval limits don't match values`);
            }
            else {
                searchByPrice($("#startprice").val(), $(this).val(), 12);
            }
        } else {
            searchByPrice($("#startprice").val(), $(this).val(), 12);
        }
    });

    $("th[name=sort]").click(function () {
        if ($(this.getElementsByTagName("span")).attr(`class`) == "glyphicon glyphicon-arrow-down") {
            $(this.getElementsByTagName("span")).removeClass("glyphicon glyphicon-arrow-down");
            $(this.getElementsByTagName("span")).toggleClass("glyphicon glyphicon-arrow-up");
        }
        else {
            $(this.getElementsByTagName("span")).removeClass("glyphicon glyphicon-arrow-up");
            $(this.getElementsByTagName("span")).toggleClass("glyphicon glyphicon-arrow-down");
        }
        var table = $(this).parents('table').eq(0)
        var rows = table.find('tr:gt(1)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc) { rows = rows.reverse() }
        for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
    });

    $('#cmbFilter').change(function () {
        if ($(this).val() == `All`) {
            $("#table td.col1").parent().show();
        } else {
            $("#table td.col1:contains('" + $(this).val() + "')").parent().show();
            $("#table td.col1:not(:contains('" + $(this).val() + "'))").parent().hide();
        }
    });

    $("input:button[name=Process]").click(function () {
        var customer = ``;
        for (drive in data) {
            if (data[drive].Id == this.id) {
                customer = data[drive].Customer;     
                processDrive(this.id, user, customer);
                break;
            }
        }
    });
};

let writeNewDispDrive = function (user, drivers) {
    let temp = ``;
    for (driver in drivers) {
        temp += `<option value="${drivers[driver].UserName}">${drivers[driver].UserName} - ${drivers[driver].Name}` + ` ${drivers[driver].Surname}` + `${carTypeToString(drivers[driver].Car.Type)}</option>`
    }
    ShowMap("#divwriteuserdata");
    $("#divwriteuserdata").append(`<table class="table table - bordered" style="float:right;width:50%;padding:200px 0px 200px 0px;">
        <thead>
        <tr class="success">
            <th colspan="2">
                Create new drive
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Your current address:</td>
            <td>
                <input type="text" id="txtAddress"/>
            </td>
        </tr>
        <tr>
            <td>Coordinates:</td>
            <td>
                <input type="text" id="txtX"/>
                <input type="text" id="txtY"/>
            </td>
        </tr>
        <tr>
            <td>Type of car(not needed):</td>
            <td>
                <select id="cmbCar">
                    <option value="0">Default</option>
                    <option value="1">Passenger car</option>
                    <option value="2">Van</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Available drivers:</td>
            <td>
                <select id="cmbDriver">
                    ${temp}
                </select>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnCreate" class="btn btn-primary" type="button" value="Create"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnSubmitLoc").click(function () {
        alert(jsonobj);
        $.post("/api/Dispatcher/GetLocation/", { json: jsonobj }, function (location) {
            $("#txtAddress").val(location.Address.Street + location.Address.HomeNumber);
            $("#txtX").val(location.X);
            $("#txtY").val(location.Y);
            $.get("/api/Dispatcher/GetClosestDrivers/", { x1: $("#txtX").val(), y1: $("#txtY").val() }, function (data) {
                var temp1 = ``;
                for (driver in data) {
                    temp1 += `<option value="${data[driver].UserName}">${data[driver].UserName} - ${data[driver].Name}` + ` ${data[driver].Surname}</option>`
                }
                $("#cmbDriver").html(temp1);
            }).fail(function () {
                alert(`greska u getu`);
            });
        })
            .fail(function () {
                alert(`error while sending location`);
            });
    });

    $("#btnCreate").click(function () {
        var address1 = $("#txtAddress").val();
        var x1 = $("#txtX").val();
        var y1 = $("#txtY").val();
        var car1 = $("#cmbCar").val();
        var driver1 = $("#cmbDriver").val();

        $.get("/api/Dispatcher/AddDispDrive/", { address: address1, x: x1, y: y1, car: car1, driver: driver1, username: user.UserName }, function () {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = "Dispatcher.html";
        })
            .fail(function () {
                alert(`error`);
            });
    });
};

let processDrive = function (driveid, user, customer) {
    let temp = ``;
    $.get("/api/Dispatcher/GetDrivers/", { username: customer, drive: driveid }, function (data) {
        for (driver in data) {
            temp += `<option value="${data[driver].UserName}">${data[driver].UserName} - ${data[driver].Name}  ${data[driver].Surname} - ${carTypeToString(data[driver].Car.Type)}</option >`;
        }
        $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="1">
                Process drive
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Available drivers:</td>
            <td>
                <select id="selectDriver">
                    ${temp}
                </select>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnProcess1" class="btn btn-primary" type="button" value="Process"/>
                </td>
            </tr>
        </tbody>
        </table >`);
        $("#btnProcess1").click(function () {
            var driver1 = $("#selectDriver").val();
            $.get("/api/Dispatcher/ProcessDrive/", { driver: driver1, username: user.UserName, cust: customer, drive: driveid }, function () {
            }).done(function () {
                alert(`Changes successfully saved`);
                location.href = "Dispatcher.html";
            })
                .fail(function () {
                    alert(`error`);
                });
        });
    }).fail(function () {
        alert(`greska u getu`);
    });
};

let addComment = function (driveid, username) {
    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="2">
                Input comment
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Rate this drive:</td>
            <td>
                <select id="cmbRate">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
        </tr>
        <tr>
            <td>Description:</td>
            <td>
                <textarea rows="3" cols="50" id="txtDesc"></textarea>
            </td>
        <tr class="success">
                <td colspan="2">
                    <input id="btnAddComment" class="btn btn-primary" type="button" value="Post comment"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnAddComment").click(function () {
        var desc = $("#txtDesc").val();
        var rating = $("#cmbRate").val();

        $.post("/api/Customer/PostComment/", { drive: driveid, description: desc, user: username, rate: rating }, function () {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = "Customer.html";
            });
        })
            .fail(function () {
                alert(`error`);
            });
};