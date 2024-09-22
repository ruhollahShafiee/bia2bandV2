$(document).ready(function () {
    
    updation()

});



function updation(){
    countMessage("sent", "sentMessage");
    countMessage("unreaded", "unreadedMessage");
    countMessage("readed", "readedMsg");
    getAllMessage() ;
}
function countMessage(statusParam, targetElement) {


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/message/count/" + statusParam,
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            $("#" + targetElement).empty()
            $("#" + targetElement).append(response)

        },
        error: function (xhr, status, error) {

        }
    });


}
function sendMessageBox(){
    
    let payload = {
        "content": $("#sendMesgInput").val(),
        "parentID": $("#parentID").val(),
        "toArtistUsername": $("#toArtistUsername").val()
    }


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/message/create",
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        contentType: "application/json", // Set the content type
        data: JSON.stringify(payload),
        success: function (response) {

            $("#msg_history").append(
                '<div class="outgoing_msg">' +
                '<div class="sent_msg">' +
                '<p>' +
                response.message +
                '</p>' +
                '<span class="time_date"> ' + formatDateTime(new Date(response.createdDate), 'mm/dd hh:MM') + '</span>' +
                '</div>' +
                '</div><div style="clear: both;"></div>'
            )
            $("#sendMesgInput").val("")
            updation()
        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")
            

        }
    });
}


function createMessage(tagObj) {

    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')

    let payload = {
        "content": $("#content").val(),
        "parentID": null,
        "toArtistUsername": $("#ac-menu-1-0").attr("data-value")
    }


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/message/create",
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        contentType: "application/json", // Set the content type
        data: JSON.stringify(payload),
        success: function (response) {

            alert("ارسال شد")
            $("#messageCreation").modal("toggle")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            updation()

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")
            $("#messageCreation").modal("toggle")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });

}


function getListOofMessage(fromArtistId, toArtistId) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/message/get/" + fromArtistId + "/" + toArtistId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            
            $("#msg_history").empty();
            for (let msg of response) {
                if (msg.selfId == msg.toArtistId) {
                    
                    $("#msg_history").append(
                        '<div class="incoming_msg">' +
                        '<div class="incoming_msg_img">' +
                        '<img class="chatUserImage"' +
                        ' src="assets/images/user-profile.png"' +
                        ' alt="sunil">' +
                        '</div>' +
                        '<div class="received_msg">' +
                        '<div class="received_withd_msg">' +
                        '<p>' +
                        msg.message +
                        '</p>' +
                        '<span class="time_date"> ' + formatDateTime(new Date(msg.createdDate), 'mm/dd hh:MM') + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div><div style="clear: both;"></div>')
                        
                        $("#toArtistUsername").val(msg.fromArtistId)
                }
                else {
                    $("#msg_history").append(
                        '<div class="outgoing_msg">' +
                        '<div class="sent_msg">' +
                        '<p>' +
                        msg.message +
                        '</p>' +
                        '<span class="time_date"> ' + formatDateTime(new Date(msg.createdDate), 'mm/dd hh:MM') + '</span>' +
                        '</div>' +
                        '</div><div style="clear: both;"></div>'
                    )
                    $("#toArtistUsername").val(msg.toArtistId)
                    
                        
                }
                
                
                $("#parentID").val(msg.id)
            }
            updation()
            
            $("#messageBox").modal("toggle")

        },
        error: function (xhr, status, error) {

        }
    });
}

function getAllMessage() {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    $.ajax({
        url: "backend/api/message/all",
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            let element = '';
            for (const key in response) {
                if (response.hasOwnProperty(key) && key != "-1") {
                    element +=
                        '<tr class="td_content">' ;
                    if (response[key].fromArtistId == response["-1"].fromArtistId) {
                        
                        element += 
                        '<td class="td_content text-center"><img class="chatUserImage msg_image_rec" src="'+(response[key].toArtistImageProfileLink != "" ? response[key].toArtistImageProfileLink:"assets/images/user-profile.png")+'" alt="sunil"/></td>'
                        element += '<td class="td_content text-center"><span class="me-2">'+response[key].toArtistName +'</span></td>';
                    }
                    else {
                        element += '<td class="td_content text-center"><img class="chatUserImage " src="'+(response[key].fromArtistImageProfileLink != "" ? response[key].fromArtistImageProfileLink:"assets/images/user-profile.png")+'" alt="sunil"/></td>'
                        element += '<td class="td_content text-center"><span class="">'+response[key].fromArtistName +'</span></td>';
                    }
                    element +=
                        '<td class="td_content text-center"><a href="javascript:void(0);" onclick="getListOofMessage('+response[key].fromArtistId+', '+response[key].toArtistId+')"> مشاهده</a></td>' +
                        '</tr>';

                }
            }
            $("#messageContent").empty()
            $("#messageContent").append(element)
            


        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")


        }
    });

}


function formatDateTime(date, format) {
    const map = {
        mm: String(date.getMonth() + 1).padStart(2, '0'),
        dd: String(date.getDate()).padStart(2, '0'),
        yyyy: date.getFullYear(),
        hh: String(date.getHours()).padStart(2, '0'),
        MM: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0'),
    };

    return format.replace(/mm|dd|yyyy|hh|MM|ss/gi, (matched) => map[matched]);
}