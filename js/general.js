function login(username_var, password_var, tagObj) {
    saveUsernamePass(username_var, password_var);
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
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            getUserName()

            $("#passError").removeClass("showErr")
            $("#mobileError").removeClass("showErr")
            $("#mobileError").addClass("dontShowError")
            $("#passError").addClass("dontShowError")
            $("#loginPopup").modal("toggle");
            location.href = 'pishkhan.html';


        },
        error: function (xhr, status, error) {

            if (xhr.responseJSON.status == 401 && xhr.responseJSON.error == 'mobile') {

                $("#mobileError").addClass("showErr")
                $("#mobileError").removeClass("dontShowError")

                $("#passError").addClass("dontShowError")
                $("#passError").removeClass("showErr")

            }
            else if (xhr.responseJSON.status == 401 && xhr.responseJSON.error == 'password') {
                $("#passError").addClass("showErr")
                $("#passError").removeClass("dontShowError")

                $("#mobileError").addClass("dontShowError")
                $("#mobileError").removeClass("showErr")
            }
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            // location.href = 'index.html';
            console.error("Error fetching data:", error);
        }
    });


}

function getUserName() {
    let access_token = getCookie("access_token");
    // if (access_token == undefined || access_token == "" || access_token == null) {
    //     location.href = 'index.html';
    // }

    $.ajax({
        // url: window.location.origin.replace("3000", "5000") + "/api/cloud/sharepoint/companyMatching/all",
        url: "backend/api/artist/getInfo/0",
        method: "get",
        headers: {
            Authorization: "Bearer " + access_token
        },
        // contentType: "application/json", // Set the content type
        success: function (response) {
            $(".logginedClass").attr("style", "display: inline-block !important;");
            $(".logginedClassNot").attr("style", "display: none !important;");
            $("#usernameBtn").empty()
            $("#usernameBtn").append(response.firstname)
            if (response.profile != null) {
                $("#imageProfileMenu").attr("src", response.profile.mediaUrl)
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401 || xhr.status == 403) {
                eraseCookie("access_token")
                // location.href = 'index.html';
            }

            // console.error("Error fetching data:", error);
        }
    });


}

function toggleActivation(selectedObj, targetTagtoRemove) {

    $("." + targetTagtoRemove).removeClass("active")
    $(selectedObj).addClass("active")

}


function logout() {
    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
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
            $(".logginedClass").attr("style", "display: none !important;");
            $(".logginedClassNot").attr("style", "display: flex !important;");

        },
        error: function (xhr, status, error) {
            if (xhr.status == 401 || xhr.status == 403) {
                eraseCookie("access_token")
                $(".logginedClass").attr("style", "display: none !important;");
                $(".logginedClassNot").attr("style", "display: flex !important;");
            }

        }
    });
}



function getAllCities(calbackSuccess, calbackError) {
    let access_token = getCookie("access_token");
    // if (access_token == undefined || access_token == "" || access_token == null) {
    //     location.href = 'index.html';
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




function addInterseted(thisObj, id, type) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/interested/add/" + id + "/" + type,
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            alert("اضافه شد")

        },
        error: function (xhr, status, error) {

            if (xhr.status == 403 || xhr.status == 401) {
                alert("برای افزودن به علاقمندی بایستی وارد سایت بشوید")
            }

        }
    });
}


// Function to load external HTML into a specific div
function loadHTML(id, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
            addActiveInActiveONHeader()
            if (file == 'header.html') {
                showRecoverPassword()
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

$(document).ready(function () {
    getUserName();
    loadHTML("naveBar", "header.html")
    loadHTML("footerHtml", "footer.html")



});



function saveUsernamePass(usernameParam, passwordParam) {
    // Get the checkbox element by its ID
    var checkbox = document.getElementById('saveUserCheckBox');

    if (checkbox.checked) {
        setCookie("savedUser", true, 7)
        setCookie("usernameParam", usernameParam, 7)
        setCookie("passwordParam", passwordParam, 7)
    } else {
        eraseCookie("savedUser")
        setCookie("savedUser", false, 7)
        eraseCookie("usernameParam")
        eraseCookie("passwordParam")
    }

}

function showLoginPopup() {


    if (getCookie("savedUser") == "true") {
        $('#username').val(getCookie("usernameParam"))
        $('#fpass').val(getCookie("passwordParam"))
        var checkbox = document.getElementById('saveUserCheckBox');
        checkbox.checked = true;
    }
    else {
        $('#username').val("")
        $('#fpass').val("")
        var checkbox = document.getElementById('saveUserCheckBox');
        checkbox.checked = false;
    }

    $("#loginPopup").modal("toggle")

}


function addActiveInActiveONHeader() {
    let path = window.location.pathname;
    let pageName = path.substring(path.lastIndexOf('/') + 1);

    $(".nav-link").removeClass("active")


    if (pageName.includes("aboutMe.html")) {

        $("#aboutMeHTML").addClass("active")
    }
    else if (pageName.includes("admin_dashboard.html")) {

        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("business.html")) {
        $("#businessHtml").addClass("active")

    }
    else if (pageName.includes("group_view.html")) {
        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("instersted_dashboard.html")) {
        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("index.html")) {

        $("#indexHtml").addClass("active")

    }
    else if (pageName.includes("messageing_dashboard.html")) {

        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("personal_group.html")) {

        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("profile_view.html")) {

        $("#navbarDarkDropdownMenuLink").addClass("active")
    }
    else if (pageName.includes("profile.html")) {

        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("search.html")) {

        $("#searchHtml").addClass("active")

    }
    else if (pageName.includes("ticket_dashboard.html")) {
        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else if (pageName.includes("pishkhan.html")) {
        $("#navbarDarkDropdownMenuLink").addClass("active")

    }
    else {
        $("#indexHtml").addClass("active")
    }



}


function togglePasswordVisibility(targetObj, secondObj) {
    var passwordField = document.getElementById(targetObj);
    var toggleIcon = document.getElementById(secondObj);

    // Toggle the password input type
    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}




function showRecoverPassword() {
    let currentUrl = window.location.href;

    if (currentUrl.includes("recoverCode")) {
        $("#recoveryPassPopUp").modal("toggle")
    }
}


function recoverPassword(tagObj,messageParam,firstPassParam,secondPassPAram) {


    let validationResult = validatePassword(messageParam,firstPassParam, secondPassPAram)
    if(!validationResult ){

        return ;
    }

    let urlParams = new URLSearchParams(window.location.search);
    let uniqueCode = urlParams.get("recoverCode");
    let pass = $("#rpass").val();

    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    $.ajax({
        url: "backend/api/auth/recoverPass",
        method: "POST",
        data: JSON.stringify({
            code: uniqueCode,
            pass: pass
        }),
        contentType: "application/json", // Set the content type
        success: function (response) {

            alert("رمز جدید با موفقیت بروز شد. لطفا با رمز عبور جدید وارد شوید ")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            $("#recoveryPassPopUp").modal("toggle")
            showLoginPopup()

        },
        error: function (xhr, status, error) {

            // $("#recoveryPassPopUp").modal("toggle")
            alert("سامانه به خطا خورده است لطفا مجددا تلاش کنید ")

            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
        }
    });


}


function validatePassword(targetObj,password, passwrod2) {

    $("#"+targetObj).addClass("dontShowError")

    if (passwrod2 != password) {
        $("#"+targetObj).addClass("showErr")
        $("#"+targetObj).removeClass("dontShowError")
        $("#"+targetObj).empty()
        $("#"+targetObj).append("رمز عبور یکسان نیست")
        return false;
        
    }

    var hasLetter = /[A-Za-z]/;
    var hasNumber = /[0-9]/;
    if (password.length < 8) {
        $("#"+targetObj).addClass("showErr")
        $("#"+targetObj).removeClass("dontShowError")
        $("#"+targetObj).empty()
        $("#"+targetObj).append("حداقل شامل 8 کارکتر باشد")
        return false;

        
    }

    // Check if the password has at least one letter
    if (!hasLetter.test(password)) {
        $("#"+targetObj).addClass("showErr")
        $("#"+targetObj).removeClass("dontShowError")
        $("#"+targetObj).empty()
        $("#"+targetObj).append("حداقل شامل یک حرف باشد")
        return false;
        
    }

    // Check if the password has at least one number
    if (!hasNumber.test(password)) {
        $("#"+targetObj).addClass("showErr")
        $("#"+targetObj).removeClass("dontShowError")
        $("#"+targetObj).empty()
        $("#"+targetObj).append("حداقل شامل یک عدد باشد")
        return false;
        
    }

    return true;
}



function sendEmailOrSms(tagObj,mobileOrEmail) {
    $("#recoverMobileError").removeClass("showErr")
    $("#recoverMobileError").addClass("dontShowError")

    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var mobileRegex = /^\d{10}$/; 

    let url = "backend/api/auth/sms/"+mobileOrEmail;
    if (emailRegex.test(mobileOrEmail)) {
        url = "backend/api/auth/email/"+mobileOrEmail;
    }
    
    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    $.ajax({
        url: url,
        method: "POST",
        contentType: "application/json", // Set the content type
        success: function (response) {

            alert("لینک بازیابی رمز برای شما پیامک شد ، پس از مشاهده و تنظیم رمز جدید میتوانید وارد شوید ")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            // $("#recoveryPopUp").modal("toggle")

        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON.status == 401 && xhr.responseJSON.error == 'notRegister'){
                $("#recoverMobileError").removeClass("dontShowError")
                $("#recoverMobileError").addClass("showErr")
                $("#recoverMobileError").empty()
                $("#recoverMobileError").append("موبایل/ایمیل در سامانه رجیستر نشده است")
                
            }
            
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            
        }
    });


}