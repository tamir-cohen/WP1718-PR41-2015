let driveStatusToString = function (drivestatus) {
    switch (drivestatus) {
        case 0:
            return `Created & Waiting`;
        case 1:
            return `Created`;
        case 2:
            return `Processed`;
        case 3:
            return `Taken`;
        case 4:
            return `Canceled`;
        case 5:
            return `Failed`;
        case 6:
            return `Successful`;
        default:
            return `Unknown status`;
    }
};

let carTypeToString = function (cartype) {
    switch (cartype) {
        case 0:
            return `Unspecified`;
        case 1:
            return `Passenger car`;
        case 2:
            return `Van`;
        default:
            return `Unknown type`;
    }
};

let roleToString = function (role) {
    switch (role) {
        case 0:
            return `Admin`;
        case 1:
            return `Driver`;
        case 2:
            return `Customer`;
        default:
            return `Unknown role`;
    }
};

let writeDriverDrives = function (data, username) {
    let temp = ``;
    let data22 = data;
    for (drive in data) {
        temp += `<tr>`;
        temp += (`<td>${data[drive].DateTime}</td>`);
        temp += (`<td>${(data[drive].Customer == null) ? `-` : data[drive].Customer}</td>`);
        temp += (`<td>${(data[drive].Dispatcher == null) ? `-` : data[drive].Dispatcher}</td>`);
        temp += (`<td>${(data[drive].Driver == null) ? `-` : data[drive].Driver}</td>`);
        temp += (`<td class="col1">${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${carTypeToString(data[drive].TypeOfCar)}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? `-` : (data[drive].StartLocation.Address.Street +" "+ data[drive].StartLocation.Address.HomeNumber +" "+  data[drive].StartLocation.Address.City +" "+ data[drive].StartLocation.Address.PostCode)}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? `-` : (data[drive].EndLocation.Address.Street +" "+ data[drive].EndLocation.Address.HomeNumber + " " + data[drive].EndLocation.Address.City +" "+ data[drive].EndLocation.Address.PostCode)}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : writeModal(data[drive].Comment)}</td >`);
        temp += (`<td>${(data[drive].Comment == null) ? `0` : data[drive].Comment.Rate}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="T${data[drive].Id}" type="button" class="btn btn-primary" name="Take" value="Take drive"/></td>` : ``);
        temp += ((data[drive].DriveStatus == `1` || data[drive].DriveStatus == `2` || data[drive].DriveStatus == `3`) ? `<td><input id="F${data[drive].Id}" name="Finish" class="btn btn-primary" type="button" value="Finish drive"/></td>` : ``);
        temp += `</tr>`;
    };

    $("#divwriteuserdata").html(`<table id="table" class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="11" style="text-align:center">
                All drives in system
                </th>
        </tr>
        <tr class="success">    
            <th name="sort" style="cursor:pointer">Date & time<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>Customer</th>
            <th>Dispatcher</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Car type</th>
            <th name="sortByDistance" style="cursor:pointer">Start location<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>End location</th>
            <th name="sort" style="cursor:pointer">Price<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
            <th>Comment</th>
            <th name="sort" style="cursor:pointer">Rate<span name="span" class="glyphicon glyphicon-arrow-down"/></th>
        </tr>
        </thead>
        <tbody>${temp} 
        </tbody>
    </table>
    <table class="table table - bordered">
        <tbody>
        <tr class="success">
            <td>From: <input type="datetime-local" id="startdatetime"/></br>To: <input type="datetime-local" id="enddatetime"/></td>
            <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
            <td>From: <input type="number" id="startprice"/></br>To: <input type="number" id="endprice"/></td><td></td>
            <td>From: <input type="number" id="startrate"/></br>To: <input type="number" id="endrate"/></td>
        </tr>
        </tbody>
    </table>
    <div>
        <select id="cmbFilter">
            <option value="All">All</option>
            <option value="Created & Waiting">Created & Waiting</option>
            <option value="Created">Created</option>
            <option value="Processed">Processed</option>
            <option value="Taken">Taken</option>
            <option value="Canceled">Canceled</option>
            <option value="Failed">Failed</option>
            <option value="Successful">Successful</option>
        </select>
    </div>`);

    $("#startdatetime").change(function () {
        searchByDate($("#startdatetime").val(), $("#enddatetime").val());
    });

    $("#enddatetime").change(function () {
        searchByDate($("#startdatetime").val(), $("#enddatetime").val());
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

    $("th[name=sortByDistance]").click(function () {
        $.get("/api/Driver", function (user) {
            var x1 = user.Location.X;
            var y1 = user.Location.Y;
            var ret = data22.sort(function (a, b) {
                return GetAbsoluteDistance(a.StartLocation.X, x1, a.StartLocation.Y, y1) - GetAbsoluteDistance(b.StartLocation.X, x1, b.StartLocation.Y, y1);
            });
            writeDriverDrives(ret, username);
        });
    });

    $('#cmbFilter').change(function () {
        if ($(this).val() == `All`) {
            $("#table td.col1").parent().show();
        } else {
            $("#table td.col1:contains('" + $(this).val() + "')").parent().show();
            $("#table td.col1:not(:contains('" + $(this).val() + "'))").parent().hide();
        }
    });
    $("input:button[name=Take]").click(function () {
        $.get("/api/Driver/TakeDrive/", { drive: this.id, user: username }, function () {
            location.href = "Driver.html";
        })
            .fail(function () {
                alert(`cannot take drive`);
            });
    });

    $("input:button[name=Finish]").click(function () {
        writeFinishDrive(this.id, username);
    });
};

let writeFinishDrive = function (driveid, drivername) {
    $("#divwriteuserdata").html(`<table class="table table-bordered">
        <tbody>
        <tr class="success">
            <td>Drive finished status:</td>
            <td>
                <select id="cmbStatus">
                    <option value="6">Successful</option>
                    <option value="5">Failed</option>
                </select>
            </td>
        </tr>
        </tbody>
        </table>`);
    writeSuccessForm(driveid, drivername);
    $("#cmbStatus").change(function () {
        if (this.value == "5") {
            writeFailForm(driveid, drivername);
        }
        else if (this.value == "6") {
            writeSuccessForm(driveid, drivername);
        }
    });
};

let writeSuccessForm = function (driveid, username) {

    ShowMap("#divwritefinishdata");

    $("#divwritefinishdata").append(`<table class="table table - bordered" style="float:right;width:50%;padding:200px 0px 200px 0px;">
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
            <td>Price:</td>
            <td>
                <input type="number" id="nmbPrice"/>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnFinish" class="btn btn-primary" type="button" value="Finish"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnFinish").click(function () {
        var price1 = $("#nmbPrice").val();

        $.post("/api/Driver/FinishDriveSuccess/", { jsonLocation: jsonobj, price: price1, drive: driveid }, function () {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = "Driver.html";
        })
            .fail(function () {
                alert(`error`);
            });
    });
};

let writeFailForm = function (driveid, username) {
    $("#divwritefinishdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="2">
                Please leave a comment
            </th>
        </tr>
        </thead>
        <tbody>
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

        $.post("/api/Driver/FinishDriveFail/", { drive: driveid, description: desc, user: username}, function () {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = "Driver.html";
        })
            .fail(function () {
                alert(`error with posting comment`);
            });
    });
};

function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
};
function getCellValue(row, index) { return $(row).children('td').eq(index).text() };

function searchByDate(startDate, endDate) {
    if (startDate == "" && endDate == "") {
        $("#table tbody tr").each(function () {
            $(this).show();
        });
    } else {
        if (endDate == "") {
            var startDateTimeStamp = new Date(startDate).getTime();
            $("#table tbody tr").each(function () {
                var rowDate = $(this).find('td:eq(0)').html();
                var rowDateTimeStamp = new Date(rowDate).getTime();
                if (startDateTimeStamp <= rowDateTimeStamp) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        else if (startDate == "") {
            var endDateTimeStamp = new Date(startDate).getTime();
            $("#table tbody tr").each(function () {
                var rowDate = $(this).find('td:eq(0)').html();
                var rowDateTimeStamp = new Date(rowDate).getTime();
                if (endDateTimeStamp >= rowDateTimeStamp) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        else {
            var startDateTimeStamp = new Date(startDate).getTime();
            var endDateTimeStamp = new Date(endDate).getTime();
            $("#table tbody tr").each(function () {
                var rowDate = $(this).find('td:eq(0)').html();

                var rowDateTimeStamp = new Date(rowDate).getTime();
                if (startDateTimeStamp <= rowDateTimeStamp && rowDateTimeStamp <= endDateTimeStamp) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    }
};

function searchByPrice(minval, maxval, index) {
    var min = parseInt(minval, 10);
    var max = parseInt(maxval, 10);
    $('#table tbody tr').each(function () {
        var age = parseFloat($(`td:eq(${index}):visible`, this).text()) || 0;
        if ((isNaN(min) && isNaN(max)) ||
            (isNaN(min) && age <= max) ||
            (min <= age && isNaN(max)) ||
            (min <= age && age <= max)) {
            $(this).show()
        } else {
            $(this).hide()
        }
    });
};

let writeModal = function (data) {
    return `<button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#MyModal${data.Drive}">Open comment</button>
    <div id="MyModal${data.Drive}" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Comment</h4>
                </div>
                <div class="modal-body">
                    <p>Date & time: ${data.DateTime}</p>
                    <p>Author: ${data.User}</p>
                    <p>Drive id: ${data.Drive}</p>
                    <p>Rate: ${data.Rate}</p></br>
                    <p>Description: <textarea rows="3" cols="50" readonly="true">${data.Description}</textarea></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>`
};

let addNewDriver = function () {
    $("#divwriteuserdata").html(`<table class="table table-bordered">
        <thead>
            <tr class="success">
                <th colspan="2">
                    Register new driver                    
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Username:</td>
                <td>
                    <input type="text" id="txtUsername" placeholder="Korisnicko ime..." />
                </td>
            </tr>
            <tr>
                <td>Password:</td>
                <td>
                    <input type="password" id="txtPassword"
                           placeholder="Sifra..." />
                </td>
            </tr>
            <tr>
                <td>Name:</td>
                <td>
                    <input type="text" id="txtName"
                           placeholder="Ime..." />
                </td>
            </tr>
            <tr>
                <td>Surname:</td>
                <td>
                    <input type="text" id="txtSurname"
                           placeholder="Prezime..." />
                </td>
            </tr>
            <tr>
                <td>Contact number:</td>
                <td>
                    <input type="text" id="txtNumber"
                           placeholder="Number..." />
                </td>
            </tr>
            <tr>
                <td>Gender:</td>
                <td>
                    <input type="radio" name="gender" checked="checked" value="0">  Male&nbsp;&nbsp;
                    <input type="radio" name="gender" value="1">  Female
                </td>
            </tr>
            <tr>
                <td>UPRN:</td>
                <td>
                    <input type="text" id="txtUPRN"
                           placeholder="Unique personal registration number..." />
                </td>
            </tr>
            <tr>
                <td>Email:</td>
                <td>
                    <input type="email" id="txtEmail" placeholder="Email..." />
                </td>
            </tr>
            <tr class="success">
                <td colspan="2">
                    <input id="btnRegister" class="btn btn-success" type="button"
                           value="Register" />
                </td>
            </tr>
        </tbody>
    </table>`);

    $("#btnRegister").click(function () {
        var username = $("#txtUsername").val();
        var password = $("#txtPassword").val();
        var name = $("#txtName").val();
        var surname = $("#txtSurname").val();
        var number = $("#txtNumber").val();
        var gender = $("input[name=gender]:checked").val();
        var uprn = $("#txtUPRN").val();
        var email = $("#txtEmail").val();

        $.post("/api/Dispatcher/AddNewDriver/", { username: username, password: password, name: name, surname: surname, contactNumber: number, gender: gender, uprn: uprn, email: email }, function (data) {
        }).done(function () {
            alert(`New driver registered`);
            location.href = "Dispatcher.html";
        })
            .fail(function () {
                alert('Username already exists. Try again');
            });

    });
};

let writeUsers = function (data) {
    var temp = ``;
    for (user in data) {
        temp += (`<tr><td>${data[user].split(`-`)[0]}</td><td>${data[user].split(`-`)[1]}</td><td>`);
        temp += ((data[user].split(`-`)[2] == `False`) ? `<button id="${data[user].split(`-`)[0]}" name="submit">Block</button>` : `<button id="${data[user].split(`-`)[0]}" name="submit">Unblock</button>`);
        temp += `</td></tr>`;
    }
    $("#divwriteuserdata").html(`
    <table class="table table-bordered">
        <thead><tr colspan="2"><td>Customers/Drivers</td></tr></thead>
        <tbody>
            ${temp}
        </tbody>
    </table>
    `);

    $("button[name=submit]").click(function () {
        $.get("/api/Dispatcher/BlockUser/", { username: this.id }, function (data1) {
            writeUsers(data1);
        })
            .fail(function () { alert(`Cannot perform block/unblock`);});
    });
};

function GetAbsoluteDistance(x, x1, y, y1) {
    var dx = parseFloat(x);
    var dx1 = parseFloat(x1);
    var dy = parseFloat(y);
    var dy1 = parseFloat(y1);

    var apsRastojanje = Math.pow((Math.pow((dx - dx1), 2) + Math.pow((dy - dy1), 2)), 0.5);
    alert(apsRastojanje);
    return apsRastojanje;
};