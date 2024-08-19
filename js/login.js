function login(username_var, password_var,tagObj) {
    let data = {
        "username": username_var,
        "password": password_var
    };
    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    $.ajax({
        url: "backend/api/auth/authenticate/v2",
        method: "POST",
        data: JSON.stringify({
            username: username_var,
            password: password_var
        }),
        contentType: "application/json", // Set the content type
        success: function (response) {
            setCookie("access_token", response["access_token"], 7)
            setCookie("is_admin", response["is_admin"], 7)
            access_token = response["access_token"]
            $(tagObj).find('span')[$(tagObj).find('span').length -1 ].remove() 
            location.href = 'index.html';
        },
        error: function (xhr, status, error) {
            alert("login faild!")
            $(tagObj).find('span')[$(tagObj).find('span').length -1 ].remove() 
            location.href = 'login.html';
            console.error("Error fetching data:", error);
        }
    });


}


function register(firstname, lastname, email, username, password, invitedCode, phoneNumber, tagObj) {
    let data = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "username": username,
        "password": password,
        "invitedCode": invitedCode,
        "phoneNumber": phoneNumber
    };
    
    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    $.ajax({
        url: "backend/api/auth/register/default",
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json", // Set the content type
        success: function (response) {
            setCookie("access_token", response["access_token"], 7)
            setCookie("is_admin",false,7)
            access_token = response["access_token"]
            $(tagObj).find('span')[$(tagObj).find('span').length -1 ].remove() 
            location.href = 'profile_personal.html';
        },
        error: function (xhr, status, error) {
            alert(xhr.responseJSON.error)
            $(tagObj).find('span')[$(tagObj).find('span').length -1 ].remove() 
            location.href = 'register.html';
            console.error("Error fetching data:", error);
        }
    });


}


function getSomeThing() {
    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: window.location.origin.replace("3000", "5000") + "/api/cloud/sharepoint/companyMatching/all",
        method: "get",
        headers: {
            Authorization: "Bearer " + access_token
        },
        contentType: "application/json", // Set the content type
        success: function (response) {


            $.each(response, function (index, value) {
                // $("<li>New Item</li>").appendTo("#myList");
                $('<li>'
                    + '<span class="filesize"><i>Date:</i><b>' + value['date'] + '</b></span>'
                    + '<span class="filesize"><i>Matching Number:</i><b>' + value['matchNumber'] + '</b></span>'
                    + '<span class="filesize"><i>Type:</i><b style="color: brown;">company_matching</b></span>'
                    + '<span class="file-link"><i>Result:</i><b><textarea>' + JSON.stringify(value["result"]) + '</textarea></b></span>'
                    + '<span class="file-link"><i>files:</i><b><textarea>' + value['processedFiles'] + '</textarea></b></span>'
                    // + '<span class="copy-link"><b>Details ..</b></span>'
                    + '</li>').appendTo("#history_result");
            });





        },
        error: function (xhr, status, error) {
            if (xhr.status == 401 || xhr.status == 403) {
                eraseCookie("access_token")
                location.href = 'login.html';
            }
            alert("faild!")
            console.error("Error fetching data:", error);
        }
    });


}