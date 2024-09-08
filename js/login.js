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

    if($("#password2").val() != $("#password1").val()){
        alert("رمز عبور یکسان نیست ")
        return;
    }

    let validationPassword=validatePassword(password);
    if(!validationPassword.isValid){
        alert(validationPassword.message)
        return;
    }
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


function validatePassword(password) {
    // Regular expression for strong password
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Test if the password matches the regex
    if (strongPasswordRegex.test(password)) {
        return {
            isValid: true,
            message: "Password is strong."
        };
    } else {
        return {
            isValid: false,
            message: "رمز عبور باید حداقل ۸ کاراکتر داشته باشد و شامل حداقل یک حرف بزرگ، یک حرف کوچک، یک عدد و یک کاراکتر ویژه (!@#$%^&*) باشد."
        };
    }
}


