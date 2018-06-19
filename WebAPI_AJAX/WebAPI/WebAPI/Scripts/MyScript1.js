let writeNewDrive = function (user) {
    let html;
    if (user.Role == 0) {
        html = `Dispather`;
    } else if (user.Role == 1) {
        html = `Driver`;
    } else {
        html = `Customer`;
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
        alert(x1 + y1 + address1 + car1);

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
        temp += (`<td>${data[drive].DriveStatus}</td>`);
        temp += (`<td>${data[drive].TypeOfCar}</td>`);
        temp += (`<td>${(data[drive].StartLocation == null) ? null : data[drive].StartLocation.Address}</td>`);
        temp += (`<td>${(data[drive].EndLocation == null) ? null : data[drive].EndLocation.Address}</td>`);
        temp += (`<td>${data[drive].Price}</td>`);
        temp += (`<td>${(data[drive].Comment == null) ? null : data[drive].Comment.Description}</td>`);
        temp += ((data[drive].DriveStatus == `0`) ? `<td><input id="R${data[drive].Id}" name="Remove" class="glyphicon glyphicon-remove-sign" type="button" value="Remove"/><input id="C${data[drive].Id}" name="Change" class="glyphicon glyphicon-pencil" type="button" value="Change"/></td>` : ``);
        temp += `</tr>`;
    };

    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="10" style="text-align:center">
                User drives
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

    $("input:button[name=Remove]").click(function () {
        writeCommentInput(this.id, data[0].Customer);
    });

    $("input:button[name=Change]").click(function () {
        let drive = null;
        $.get("/api/Customer/GetDrive/", { driveid: this.id, username: data[0].Customer }, function (data1) {
            drive = data1;
            alert(drive.StartLocation.Address);
            writeChangeDrive(drive);
        }).fail(function () {
            alert(drive.StartLocation.Address);
            });
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
                <input type="text" id="txtAddress" value="${drive.StartLocation.Address}"/>
            </td>
        </tr>
        <tr>
            <td>Coordinates:</td>
            <td>
                <input type="text" id="txtX" value="${drive.StartLocation.X}"/>
                <input type="text" id="txtY" value="${drive.StartLocation.Y}"/>
            </td>
        <tr>
            <td>Type of car(not needed):</td>
            <td>
                <select id="cmbCar">
                    <option value="0"${(drive.TypeOfCar == 0) ? ` selected` : ``}>Default</option>
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
        alert(x1 + y1 + address1 + car1 + drive.Id + drive.Customer);

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