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
            return `Passenger car`;
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
        temp += (`<td>${driveStatusToString(data[drive].DriveStatus)}</td>`);
        temp += (`<td>${data[drive].TypeOfCar}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? null : data[drive].StartLocation.Address}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? null : data[drive].EndLocation.Address}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? null : data[drive].Comment.Description}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="T${data[drive].Id}" type="button" name="Take" value="Take drive"/></td>` : ``);
        temp += ((data[drive].DriveStatus == `1` || data[drive].DriveStatus == `2` || data[drive].DriveStatus == `3`) ? `<td><input id="F${data[drive].Id}" name="Finish" type="button" value="Finish drive"/></td>` : ``);
        temp += `</tr>`;
    };

    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="10" style="text-align:center">
                All drives in system
                </th>
        </tr>
        <tr class="success">    
            <th>Date & time</th>
            <th>Customer</th>
            <th>Dispatcher</th>
            <th>Driver</th>
            <th>Status</th>
            <th>Car type</th>
            <th>Start location</th>
            <th>End location</th>
            <th>Price</th>
            <th>Comment</th>
        </tr>
        </thead>
        <tbody>${temp}        
        </tbody>
    </table>`);

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
    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <tr class="success">
            <td>
            <td>Drive finished status:</td>
                <select id="cmbStatus">
                    <option value="6">Successful</option>
                    <option value="5">Failed</option>
                </select>
            </td>
        </tr>
        </table>`);

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