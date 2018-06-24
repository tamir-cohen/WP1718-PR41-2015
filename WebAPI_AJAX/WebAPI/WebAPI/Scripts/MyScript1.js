let writeNewDrive = function (user) {
    let html;
    if (user.Role == 0) {
        html = `Dispather`;
    } else if (user.Role == 1) {
        html = `Driver`;
    } else {
        html = `Customer`;
    }
    $("#divwriteuserdata").html(`<table class="table table-bordered">
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
        <tr>
            <td>Type of car(not needed):</td>
            <td>
                <select id="cmbCar">
                    <option value="0">Unspecified</option>
                    <option value="1">Passenger car</option>
                    <option value="2">Van</option>
                </select>
            </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnCreate" class="btn btn-success" type="button" value="Create"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnCreate").click(function () {
        var address1 = $("#txtAddress").val();
        var x1 = $("#txtX").val();
        var y1 = $("#txtY").val();
        var car1 = $("#cmbCar").val();

        $.get("/api/Customer", { address: address1, x: x1, y: y1, car: car1, customer: user.UserName }, function (data) {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = html + ".html";
        })
            .fail(function () {
                alert(`error`);
            });
    });
};

let writeUserDrives = function (data) {
    let temp = ``;
    for (drive in data) {
        temp += `<tr>`;
        temp += (`<td>${data[drive].DateTime}</td>`);
        temp += (`<td>${data[drive].Customer}</td>`);
        temp += (`<td>${data[drive].Dispatcher}</td>`);
        temp += (`<td>${data[drive].Driver}</td>`);
        temp += (`<td class="col1">${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${carTypeToString(data[drive].TypeOfCar)}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? `-` : data[drive].StartLocation.Address}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? `-` : data[drive].EndLocation.Address}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Description}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Rate}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="${data[drive].Id}" name="Remove" type="button" value="Cancel"/><input id="C${data[drive].Id}" name="Change" type="button" value="Edit"/></td>` : ``);
        temp += ((data[drive].DriveStatus == `6`) ? `<td><input id="${data[drive].Id}" name="AddComment" type="button" value="Add comment"/>` : ``);
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
    <tbody>
        <tr class="success">
            <td>From: <input type="datetime-local" id="startdatetime" /></br>To: <input type="datetime-local" id="enddatetime" /></td>
        <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
        <td>From: <input type="number" id="startprice" /></br>To: <input type="number" id="endprice" /></td> <td></td>
    <td>From: <input type="number" id="startrate" /></br>To: <input type="number" id="endrate" /></td >
    </tr >
    </tbody >
    </table >
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
                    <input id="btnChange" class="btn btn-success" type="button" value="Save Changes"/>
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
                    <input id="btnSendComment" class="btn btn-success" type="button" value="Post comment"/>
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
        temp += `<tr>`;
        temp += (`<td>${data[drive].DateTime}</td>`);
        temp += (`<td>${data[drive].Customer}</td>`);
        temp += (`<td>${data[drive].Dispatcher}</td>`);
        temp += (`<td>${data[drive].Driver}</td>`);
        temp += (`<td class="col1">${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${carTypeToString(data[drive].TypeOfCar)}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? `-` : data[drive].StartLocation.Address}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? `-` : data[drive].EndLocation.Address}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Description}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Rate}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="${data[drive].Id}" name="Process" type="button" value="Process drive"/>` : ``);
        temp += `</tr>`;
    };

    $("#divwriteuserdata").html(`<table id="table" class="table table-bordered">
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
    <table class="table table-bordered">
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
        temp += `<option value="${drivers[driver].UserName}">${drivers[driver].UserName} - ${drivers[driver].Name}`+` ${drivers[driver].Surname}</option>`
    }
    $("#divwriteuserdata").html(`<table class="table table - bordered">
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
                    <input id="btnCreate" class="btn btn-success" type="button" value="Create"/>
                </td>
            </tr>
        </tbody>
    </table >`);

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
    $.get("/api/Dispatcher/GetAvailableDrivers", function (data) {
        for (driver in data) {
            temp += `<option value="${data[driver].UserName}">${data[driver].UserName} - ${data[driver].Name}` + ` ${data[driver].Surname}</option>`;
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
                    <input id="btnProcess1" class="btn btn-success" type="button" value="Process"/>
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
                    <input id="btnAddComment" class="btn btn-success" type="button" value="Post comment"/>
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