let writeUserData = function (user) {
    $("#divwriteuserdata").html(`<table class="table table - bordered">
        <thead>
        <tr class="success">
            <th colspan="2">
                User data
                </th>
        </tr>
        </thead>
    <tbody>
        <tr>
            <td>Username:</td>
            <td>
                ` + user.UserName + `
                </td>
        </tr>
        <tr>
            <td>Name:</td>
            <td>
                ` + user.Name + `
                </td>
        </tr>
        <tr>
            <td>Surname:</td>
            <td>
                ` + user.Surname + `
                </td>
        </tr>
        <tr>
            <td>Contact number:</td>
            <td>
                ` + user.ContactNumber + `
                </td>
        </tr>
        <tr>
            <td>Gender:</td>
            <td>
                ` + ((user.Gender == "0") ? `Male` : `Female`) + `
                </td>
        </tr>
        <tr>
            <td>UPRN:</td>
            <td>
                ` + user.UPRN + `
                </td>
        </tr>
        <tr>
            <td>Email:</td>
            <td>
                ` + user.Email + `
                </td>
        </tr>
    </tbody>
    </table >`);
};

let writeChangeUserData = function (user) {
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
                Change user data
                </th>
        </tr>
        </thead>
    <tbody>
        <tr>
            <td>Username:</td>
            <td>
                ` + user.UserName + `
                </td>
        </tr>
        <tr>
            <td>Name:</td>
            <td>
                <input type="text" id="txtName" value="`+ user.Name + `"/>
                </td>
        </tr>
        <tr>
            <td>Surname:</td>
            <td>
                <input type="text" id="txtSurname" value="`+ user.Surname + `"/>
                </td>
        </tr>
        <tr>
            <td>Contact number:</td>
            <td>
                <input type="text" id="txtNumber" value="`+ user.ContactNumber + `"/>
                </td>
        </tr>
        <tr>
            <td>Gender:</td>
            <td>
                <input type="radio" name="gender" ` + ((user.Gender == "0") ? `checked="checked"` : ``) + ` value="0">  Male&nbsp;&nbsp;
                <input type="radio" name="gender" ` + ((user.Gender == "1") ? `checked="checked"` : ``) + ` value="1">  Female
                </td>
        </tr>
        <tr>
            <td>UPRN:</td>
            <td>
                <input type="text" id="txtUPRN" value="`+ user.UPRN + `"/>
                </td>
        </tr>
        <tr>
            <td>Email:</td>
            <td>
                <input type="text" id="txtEmail" value="`+ user.Email + `"/>
                </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnChange" class="btn btn-success" type="button"
                           value="Save changes" />
                </td>
            </tr>
    </tbody>
    </table >`);

    $("#btnChange").click(function () {
        var name = $("#txtName").val();
        var surname = $("#txtSurname").val();
        var number = $("#txtNumber").val();
        var gender = $("input[name=gender]:checked").val();
        var uprn = $("#txtUPRN").val();
        var email = $("#txtEmail").val();

        $.post("/api/" + html, { username: user.UserName, password: user.Password, name: name, surname: surname, contactNumber: number, gender: gender, uprn: uprn, email: email }, function (data) {
        }).done(function () {
            alert(`Changes successfully saved`);
            location.href = html + ".html";
        })
            .fail(function () {
                alert('Failed. Changes not saved');
            });

    });
};

let writeChangePassword = function (user) {
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
                Change password
                </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Current password:</td>
            <td>
                <input type="text" id="txtOldPassword"/>
                </td>
        </tr>
        <tr>
            <td>New password:</td>
            <td>
                <input type="text" id="txtNewPassword"/>
                </td>
        </tr>
        <tr>
            <td>Confirm new password:</td>
            <td>
                <input type="text" id="txtConfirmPassword"/>
                </td>
        </tr>
        <tr class="success">
                <td colspan="2">
                    <input id="btnChangePassword" class="btn btn-success" type="button"
                           value="Save new password" />
                </td>
            </tr>
        </tbody>
    </table >`);
    $("#btnChangePassword").click(function () {
        var password = $("#txtNewPassword").val();
        var oldpassword = $("#txtOldPassword").val();
        var confirmpassword = $("#txtConfirmPassword").val();

        if (oldpassword != user.Password) {
            alert(`Current password is not correct`);
        }
        else {
            if (password != confirmpassword) {
                alert(`Confirm password does not match to new one`);
            }
            else {
                $.post("/api/" + html, { username: user.UserName, password: password, name: user.Name, surname: user.Surname, contactNumber: user.ContactNumber, gender: user.Gender, uprn: user.UPRN, email: user.Email }, function (data) {
                }).done(function () {
                    alert(`Changes successfully saved`);
                    location.href = html + ".html";
                })
                    .fail(function () {
                        alert('Failed. Changes not saved');
                    });
            }
        }

    });
};