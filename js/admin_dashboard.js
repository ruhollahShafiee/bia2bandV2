function getListOfInvatedCode() {


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/invited_code/all",
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            let tr = '';
            for (invatedCode of response) {

                let invatedCodeId = 'invatedCodeInput_' + invatedCode.id;
                tr += '<tr class="td_content">' +
                    '<td class="td_content text-center align-middle" style="font-weight: lighter;">' +
                    invatedCode.code +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    invatedCode.usedCount +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    '<input type="text" value="' + invatedCode.maxUsed + '" class="form-control iranYekanLight" id="' + invatedCodeId + '"' +
                    ' placeholder="4">' +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    '<a href="javascript:void(0);" onclick="updateInvaitedCode(' + invatedCode.id + ',$(\'#' + invatedCodeId + '\').val())"> ذخیره</a>' +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    '<a href="javascript:void(0);" onclick="$(\'#ConfirmPopUp\').modal(\'toggle\');$(\'#ConfirmPopUpBtn\').attr(\'onclick\',\'removeInvatedCode(' + invatedCode.id + ');$(\\\'#ConfirmPopUp\\\').modal(\\\'toggle\\\');\')"> حذف</a>' +
                    '</td>' +
                    '</tr>'

            }


            $("#InvatedCodeTBody").empty()
            $("#InvatedCodeTBody").append(tr)


        },
        error: function (xhr, status, error) {



        }
    });
}


function removeInvatedCode(id) {
    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/invited_code/remove/" + id,
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            getListOfInvatedCode()

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")

        }
    });
}



function updateInvaitedCode(id, maxUsedVal) {
    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/invited_code/update/" + id + "/" + maxUsedVal,
        method: "PUT",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            alert("انچام شد !")

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")

        }
    });
}




function addInvatedCode(codeName, maxUsed) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/invited_code/create/" + codeName + "/" + maxUsed,
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            $('#anserMediaOverview').modal('toggle');
            getListOfInvatedCode()

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")

        }
    });
}

function getListOfUsers() {


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/artist/all",
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            let tr = '';
            for (artist of response) {

                let skills = '';
                if (artist.skills != null) {

                    for (skillIndex of artist.skills) {
                        skills += (skillIndex.category != null ? ' | ' + skillIndex.category.name : '')
                    }
                }

                skills += (skills != '' ? "|" : "")

                tr += '<tr class="td_content">' +
                    '<td class="td_content text-center align-middle" style="font-weight: lighter;">' +
                    artist.firstname +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    (artist.confirmed ? '<span style="color: #1EE51A;">هست</span>' : '<span style="color: #E5241A;">نیست</span>') +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    (artist.informationCompleted ? '<span style="color: #1EE51A;">هست</span>' : '<span style="color: #E5241A;">نیست</span>') +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    skills +
                    '</td>' +
                    '<td class="td_content text-center align-middle">' +
                    '<a href="javascript:void(0);" onclick="getListOfMediaOfArtist('+artist.id+') "> تصاویر(جهت تایید)</a>' +
                    '</td>' +
                    '</tr>'

            }

            $("#usersTable").empty()
            $("#usersTable").append(tr)


        },
        error: function (xhr, status, error) {



        }
    });
}


function settingUpConfiguration(id){
    $("#userMedias").modal("toggle")
    $("#userMediaNotConfirm").attr("onclick", "notConfirm("+id+")");
    $("#userMediaConfirm").attr("onclick", "confirm("+id+")");
}


function notConfirm(aritstId){
    
    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/artist/update/mapping/"+aritstId+"/false",
        method: "PUT",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {
            getListOfUsers()
            $("#userMedias").modal("toggle")

        },
        error: function (xhr, status, error) {
        }
    });
}


function confirm(artistId){

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/artist/update/mapping/"+artistId+"/true",
        method: "PUT",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {
            getListOfUsers()
            $("#userMedias").modal("toggle")

        },
        error: function (xhr, status, error) {
        }
    });


}

function getListOfMediaOfArtist(artistId) {


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/artist/all/medias/" + artistId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            let row = '<div class="row">';
            let i = 0;
            for (mediaIndex of response) {

                if(mediaIndex == null ){
                    continue;
                }

                if (i % 4 == 0) {
                    row += '</div><div class="row mb-2">';

                }

                if (mediaIndex.contentType.includes("video")) {
                    row += '<div class="col-md-3 mb-2">' +
                        '<div class="ratio ratio-16x9">' +
                        '<video style="border-radius: 0.9rem; width:95%;border-width: 0px;"' +
                        ' controls="controls autoplay">' +
                        '<source src="' + mediaIndex.mediaUrl + '"' +
                        ' type="' + mediaIndex.contentType + '">' +
                        '</video>' +
                        '</div>' +
                        '</div>'
                }
                else if (mediaIndex.contentType.includes("image")) {
                    row += '<div class="col-md-3 mb-2">' +
                        '<div class="ratio ratio-16x9">' +
                        '<img src="' + mediaIndex.mediaUrl + '"' +
                        ' class="mobileImg_height" style="border-radius: 0.9rem; width:93%;"' +
                        ' title="" allowfullscreen="">' +
                        '</div>' +
                        '</div>'
                }

                i++

            }

            $("#userMediaImages").empty()
            $("#userMediaImages").append(row)

            settingUpConfiguration(artistId)


        },
        error: function (xhr, status, error) {



        }
    });
}

$(document).ready(function () {
    if (window.location.href.split("#").length >= 2) {
        $(".aMenu").removeClass('aMenuActvie');
        $('a[href^="#' + window.location.href.split("#")[1] + '"]').toggleClass('aMenuActvie')
    }
    else {
        $('a[href^="#MyPersonalInfo"]').toggleClass('aMenuActvie')
    }
    $('.aMenu').on('click', function (self) {
        $(".aMenu").removeClass('aMenuActvie');
        $(self.target).toggleClass('aMenuActvie');
    });

    if(getCookie("is_admin")){
        $("#invatedCodeListParent").css("display","inline-flex")
        $("#userListDivParent").css("display","block")
        getListOfInvatedCode();
        getListOfUsers();
    }
   
    

});
