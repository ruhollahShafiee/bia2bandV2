
function getAllBusinuss() {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        // location.href = 'login.html';
    }


    $.ajax({
        url: "backend/api/business/all",
        method: "GET",
        // headers: {
        //     Authorization: "Bearer " + access_token
        // },
        success: function (response) {
            appendToBusinuss(response)
        },
        error: function (xhr, status, error) {

            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });
}


function searchBusiness(keyword, city, category, completedProfile, sortByVisitedImage) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        // location.href = 'login.html';
    }



    $("#spinner-grow").show()
    let url = "backend/api/business/search";
    let keywordFlag = false;
    let cityFlag = false;

    if (keyword != null && keyword != undefined) {
        url += "?keyword=" + keyword
        keywordFlag = true;
    }
    if (city != null && city != undefined) {
        if (keywordFlag) {
            url += "&city=" + city
        }
        else {
            url += "?city=" + city
        }
        cityFlag = true
    }
    if (category != null && category != undefined) {
        if (keywordFlag || cityFlag) {
            url += "&category=" + category
        }
        else {
            url += "?category=" + category
        }
    }

    url += "&completedProfile=" + completedProfile
    url += "&sortByVisitedImage=" + sortByVisitedImage
    $.ajax({
        url: url,
        method: "GET",
        // headers: {
        //     Authorization: "Bearer " + access_token
        // },
        success: function (response) {
            appendToBusinuss(response)
            $("#spinner-grow").hide()
        },
        error: function (xhr, status, error) {

            $("#spinner-grow").hide()
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });

}

function appendToBusinuss(response) {
    let divArr = "";
    let i = 0;
    for (business of response) {

        if (i % 4 == 0) {
            if (i != 0) {
                divArr += '</div><div class="row mt-5">';
            }
            else {
                divArr += '<div class="row">';
            }
        }

        i++;

        divArr += ' <div class="col-md-4">' +
            '<div class="card shadow-sm bg-white border-0">'
            + '<img alt="cover-3" src="' + business.background.mediaUrl + '" class="h-40 object-cover img-fluid rounded-top">'
            + '<div class="card-body avatar_margin">'
            + '<div class="card-title d-flex">'
            + '<span class="ant-avatar ant-avatar-circle ant-avatar-image -mt-14 h-24 w-24 shadow-xl css-dev-only-do-not-override-1a9vt8h">'
            + '<img   class="rounded-circle business_profile" src="' + business.profile.mediaUrl + '">'
            + '</span>'
            + '<h5 class="w-auto mt-auto ms-1">' + business.name + '</h5>'
            + '</div>'
            + '<p class="card-text desc_card">'
            + business.about
            + '</p>'
            + '<div class="card-text w-100">'
            + '<button type="button" class="btn btn-outline-secondary float-start  text-sm  px-3 w-75">'
            + '<span class="p_custom px-2">'
            + ' <a href="businessDetail.html/"' + business.id + '>  مشاهده اطلاعات</a>'
            + '</span>'
            + '</button>'
            + '<span role="img" aria-label="double-left" class="anticon float-end mt-2">'
            + '<svg viewBox="64 64 896 896" focusable="false" data-icon="book" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true">'
            + '<path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-260 72h96v209.9L621.5 312 572 347.4V136zm220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0022.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z"></path>'
            + '</svg>'
            + '</span>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';

    }
    divArr += "</div>"
    $("#businessListContainer").empty();
    $("#businessListContainer").append(divArr)
}
$(document).ready(function () {
    getAllBusinuss();
});



