function getUserName() {
    let access_token = getCookie("access_token");
    // if (access_token == undefined || access_token == "" || access_token == null) {
    //     location.href = 'login.html';
    // }

    $.ajax({
        // url: window.location.origin.replace("3000", "5000") + "/api/cloud/sharepoint/companyMatching/all",
        url: "backend/api/user/username",
        method: "get",
        headers: {
            Authorization: "Bearer " + access_token
        },
        // contentType: "application/json", // Set the content type
        success: function (response) {
            $("#usernameInfo").html(response)
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401 || xhr.status == 403) {
                eraseCookie("access_token")
                // location.href = 'login.html';
            }
            
            console.error("Error fetching data:", error);
        }
    });


}

function toggleActivation(selectedObj, targetTagtoRemove){
    
    $("."+targetTagtoRemove).removeClass("active")
    $(selectedObj).addClass("active")
    
}


function logout() {
    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({

        url: "backend/api/auth/logout",
        method: "get",
        headers: {
            Authorization: "Bearer " + access_token
        },
        // contentType: "application/json", // Set the content type
        success: function (response) {
            eraseCookie("access_token")
            location.href = 'login.html';
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401 || xhr.status == 403) {
                eraseCookie("access_token")
                location.href = 'login.html';
            }

        }
    });
}



function getAllCities(calbackSuccess,calbackError) {
    let access_token = getCookie("access_token");
    // if (access_token == undefined || access_token == "" || access_token == null) {
    //     location.href = 'login.html';
    // }

    $.ajax({
        // url: window.location.origin.replace("3000", "5000") + "/api/cloud/sharepoint/companyMatching/all",
        url: "backend/api/city/all",
        method: "get",
        headers: {
            Authorization: "Bearer " + access_token
        },
        // contentType: "application/json", // Set the content type
        success: function (response) {
            calbackSuccess(response)
        },
        error: function (xhr, status, error) {
            calbackError(error)
            
            console.error("Error fetching data:", error);
        }
    });


}


getUserName();