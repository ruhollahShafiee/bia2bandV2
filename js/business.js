function addBusiness(tagObj) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    let medias = JSON.parse(getCookie("profileMedia"));
    let mediaIds = [];
    for (media of medias) {
        mediaIds.push(media.id)
    }
    let pmediaCookie = getCookie("businussProfileMedia")
    let bbm = getCookie("businussBackgroundMedia");
    let data = {
        "id": ($("#businessId").val() == undefined ? null : $("#businessId").val()),
        "name": ($("#businessName").val() == undefined ? null : $("#businessName").val()),
        "phone": ($("#businessMobile").val() == undefined ? null : $("#businessMobile").val()),
        "address": ($("#businessAddress").val() == undefined ? null : $("#businessAddress").val()),
        "about": ($("#businessAbout").val() == undefined ? null : $("#businessAbout").val()),
        "medias": (mediaIds == undefined ? [] : mediaIds),
        "profileId": ((pmediaCookie != undefined && pmediaCookie != null && pmediaCookie.length != 0 ? JSON.parse(pmediaCookie).id : null) == null ? $("#businessProfileId").val() : (pmediaCookie != undefined && pmediaCookie != null && pmediaCookie.length != 0 ? JSON.parse(pmediaCookie).id : null)),
        "backgroundId": ((bbm != undefined && bbm != null && bbm.length != 0 ? JSON.parse(bbm).id : null) == null ? $("#businessBackgroundId").val() : (bbm != undefined && bbm != null && bbm.length != 0 ? JSON.parse(bbm).id : null))
    }

    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    $.ajax({
        url: "backend//api/business/save",
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        data: JSON.stringify(data),
        contentType: "application/json", // Set the content type
        success: function (response) {
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            eraseCookie("profileMedia")
        },
        error: function (xhr, status, error) {

            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });
}



function getBusiness() {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: "backend/api/business",
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            $("#businessId").val(response.id)
            $("#businessName").val(response.name)
            $("#businessMobile").val(response.phone)
            $("#businessAddress").val(response.address)
            $("#businessAbout").val(response.about)
            if (response.medias != null && response.medias.length != 0) {
                setCookie("profileMedia", JSON.stringify(response.medias))

            }
            loadBusinussMedia();

            if (response.profile != null) {
                eraseCookie("businussProfileMedia")
                $('#businessProfileImageId').attr('src', response.profile.mediaUrl);

                $("#businessProfileId").val(response.profile.id)
            }


            if (response.background != null) {
                eraseCookie("businussBackgroundMedia")
                $('.backgound_banner').css('background-image', 'url("' + response.background.mediaUrl + '")');
                $("#businessBackgroundId").val(response.background.id)
            }



            if (response.visible) {
                $("#visibleTogleWaiting").css("display", "none");
                $("#visibleTogleConfirm").css("display", "inline-block");
            }
            else if (!response.visible) {
                $("#visibleTogleWaiting").css("display", "inline-block");
                $("#visibleTogleConfirm").css("display", "none");
            }

        },
        error: function (xhr, status, error) {



        }
    });
}
function updateBusinuss() {
    eraseCookie("profileMedia")
}




function uploadBusinussMedia(tagObj, mediaForm) {

    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    uploadMedia(mediaForm,
        function successed(data) {

            let tmpData = getCookie("profileMedia")
            if (tmpData == undefined || tmpData == null || tmpData == "") {
                tmpData = [];
            }
            else {
                tmpData = JSON.parse(tmpData)
            }
            tmpData.push(JSON.parse(data))
            setCookie("profileMedia", JSON.stringify(tmpData))
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            loadBusinussMedia()
        },
        function error(error) {
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
        })
}

function loadBusinussMedia() {

    let medias = JSON.parse(getCookie("profileMedia"))
    $("#businessMediaContainer").empty()
    if (medias != undefined && medias != null && medias.length != 0) {

        for (media of medias) {

            let divTmp = '<div class=" col-md-3 mt-3">' +
                '<figure class="figure " style="width: 200px; height: 200px">' +
                '<img src="' + media.mediaUrl + '" class="figure-img img-fluid rounded w-100 h-100" alt="...">' +
                '<figcaption class="figure-caption">' + media.description + '</figcaption>' +
                '</figure>' +
                '</div>';
            $("#businessMediaContainer").append(divTmp)
        }
    }


}


$(document).ready(function () {
    getBusiness()

    let pmediaCookie = getCookie("businussProfileMedia")
    if (pmediaCookie != undefined && pmediaCookie != null && pmediaCookie.length != 0) {

        $('#businessProfileImageId').attr('src', JSON.parse(pmediaCookie).mediaUrl);
    }
    let bbm = getCookie("businussBackgroundMedia");
    if (bbm != undefined && bbm != null && bbm.length != 0) {
        $('.backgound_banner').css('background-image', 'url("' + JSON.parse(bbm).mediaUrl + '")');
    }
})




function updateBusinussBackground(thisObj, backgroundMediaForm) {

    $(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    uploadMedia(backgroundMediaForm,
        function successed(data) {
            setCookie("businussBackgroundMedia", data)
            $(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
            $('.backgound_banner').css('background-image', 'url("' + JSON.parse(data).mediaUrl + '")');
            $('#exampleModal').modal('toggle')
        },
        function error(error) {
            $(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
            $('#exampleModal').modal('toggle')
        })
}


function updateBusinussProfile(thisObj, profileMediaForm) {

    $(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
    uploadMedia(profileMediaForm,
        function successed(data) {
            setCookie("businussProfileMedia", data)
            $(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
            $('#businessProfileImageId').attr('src', JSON.parse(data).mediaUrl);
            $('#exampleModal2').modal('toggle')
        },
        function error(error) {
            $(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
            $('#exampleModal2').modal('toggle')
        })
}





function getAllBusinuss() {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }


    $.ajax({
        url: "backend/api/business/all",
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        data: JSON.stringify(data),
        contentType: "application/json", // Set the content type
        success: function (response) {
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
                    '<div class="card shadow-sm bg-white border-0">' +
                    +'<img alt="cover-3" src="' + business.background.mediaUrl + '" class="h-40 object-cover img-fluid">'
                    + '<div class="card-body avatar_margin">'
                    + '<div class="card-title d-flex">'
                    + '<span class="ant-avatar ant-avatar-circle ant-avatar-image -mt-14 h-24 w-24 shadow-xl css-dev-only-do-not-override-1a9vt8h">'
                    + '<img src="' + business.profile.mediaUrl + '">'
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
        },
        error: function (xhr, status, error) {

            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });
}