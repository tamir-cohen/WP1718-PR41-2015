let driveStatusToString = function (drivestatus) {
    switch (drivestatus) {
        case 0:
            return `Created & Waiting`;
            break;
        case 1:
            return `Created`;
            break;
        case 2:
            return `Processed`;
            break;
        case 3:
            return `Taken`;
            break;
        case 4:
            return `Canceled`;
            break;
        case 5:
            return `Failed`;
            break;
        case 6:
            return `Successful`;
            break;
        default:
            return `Unknown status`;
            break;
    }
};

let carTypeToString = function (cartype) {
    switch (cartype) {
        case 0:
            return `Unspecified`;
            break;
        case 1:
            return `Passenger car`;
            break;
        case 2:
            return `Van`;
            break;
        default:
            return `Unknown type`;
            break;
    }
};

let writeDriverDrives = function (data, username) {
    let temp = ``;
    for (drive in data) {
        temp += `<tr>`;
        temp += (`<td>${data[drive].DateTime}</td>`);
        temp += (`<td>${data[drive].Customer}</td>`);
        temp += (`<td>${data[drive].Dispatcher}</td>`);
        temp += (`<td>${data[drive].Driver}</td>`);
        temp += (`<td class="col1">${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${data[drive].TypeOfCar}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? `-` : data[drive].StartLocation.Address}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? `-` : data[drive].EndLocation.Address}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Description}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? `-` : data[drive].Comment.Rate}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="T${data[drive].Id}" type="button" name="Take" value="Take drive"/></td>` : ``);
        temp += ((data[drive].DriveStatus == `1` || data[drive].DriveStatus == `2` || data[drive].DriveStatus == `3`) ? `<td><input id="F${data[drive].Id}" name="Finish" type="button" value="Finish drive"/></td>` : ``);
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
    $("#divwritefinishdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="2">
                Closing drive parameters
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Destination address:</td>
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
                    <input id="btnFinish" class="btn btn-success" type="button" value="Finish"/>
                </td>
            </tr>
        </tbody>
    </table >`);

    $("#btnFinish").click(function () {
        var address1 = $("#txtAddress").val();
        var x1 = $("#txtX").val();
        var y1 = $("#txtY").val();
        var price1 = $("#nmbPrice").val();

        $.get("/api/Driver/FinishDriveSuccess/", { address: address1, x: x1, y: y1, price: price1, drive: driveid, driver: username }, function () {
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
                    <input id="btnSendComment" class="btn btn-success" type="button" value="Post comment"/>
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

function display(startDate, endDate) {
    var startDateTimeStamp = new Date(startDate).getTime();
    var endDateTimeStamp = new Date(endDate).getTime();

    $("#table tbody tr").each(function () {
        var rowDate = $(this).find('td:eq(0)').html();

        var rowDateTimeStamp = new Date(rowDate).getTime();
        if (startDateTimeStamp <= rowDateTimeStamp && rowDateTimeStamp <= endDateTimeStamp) {
            $(this).hide;
        } else {
            $(this).show;
        }
    });
};

function searchByPrice(minval, maxval, index) {
    var min = parseInt(minval, 10);
    var max = parseInt(maxval, 10);
    $('#table tbody tr').each(function () {
        var age = parseFloat($(`td:eq(${index})`, this).text()) || 0;
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