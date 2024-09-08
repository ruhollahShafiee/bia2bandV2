$(document).ready(function () {
    countTicket("open", "openedTicket");
    countTicket("inprogress", "inProgressingTicket");
    countTicket("responsed", "answeredTicket");
    countTicket("close", "closedTicket");
    getAllTicket();


});



function countTicket(statusParam, targetElement) {


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: "backend/api/ticket/countStatus/" + statusParam,
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



function addTicket(tagObj) {

    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')

    let payload = {
        "id": null,
        "subject": $("#subject").val(),
        "unitDepartmentId": $("#unitDepartmentId").val(),
        "content": $("#content").val(),
        "medias": null
    }


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: "backend/api/ticket/create",
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        contentType: "application/json", // Set the content type
        data: JSON.stringify(payload),
        success: function (response) {

            alert("ارسال شد")
            $("#ticketCreation").modal("toggle")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            countTicket("open", "openedTicket");

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")
            $("#ticketCreation").modal("toggle")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });

}

function getAllTicket() {


    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: "backend/api/ticket/all",
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {

            buildTicket(response, "contentBody")

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")
            $("#ticketCreation").modal("toggle")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });
}


function buildTicket(tickets, targetElement) {

    let tr = ""

    for (let ticket of tickets) {

        let status = ""
        if (ticket.isOpened) {
            status = "باز"
        }
        else if (ticket.isInprogress) {
            status = "در دست دسترسی"
        }
        else if (ticket.isResponsed) {
            status = "پاسخ داده شده"
        }
        else if (ticket.isClosed) {
            status = "بسته شده"
        }

        let operration = "--";

        if (ticket.unitDepartmentId == 1) {
            operration = "فنی"
        }
        else if (ticket.unitDepartmentId == 2) {
            operration = "امور مالی"
        }

        tr += '<tr class="td_content">' +
            '<td class="td_content text-center" style="font-weight: lighter;">' + ticket.id + '</td>' +
            '<td class="td_content text-center">' +
            ticket.subject +
            '</td>' +
            '<td class="td_content text-center">' + status + '</td>' +
            '<td class="td_content text-center"><span style="cursor: pointer;" onclick="getTicket(' + ticket.id + ')"> مشاهده</span></td>' +
            '<td class="td_content text-center">' + operration + '</td>' +
            '</tr>'
    }


    $("#" + targetElement).empty()
    $("#" + targetElement).append(tr)

}

function getTicket(ticketId) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: "backend/api/ticket/findById/" + ticketId,
        method: "GET",
        headers: {
            Authorization: "Bearer " + access_token
        },
        success: function (response) {


            $("#ticketId").val(response.id)
            $("#subjectTicket").val(response.subject)
            $("#unitDepartmentIdTicket").val(response.unitDepartmentId.toString())
            $("#contentTicket").val(response.content)
            $("#responseTicket").val(response.response)
            $("#artistNameTicket").val(response.artistName)
            if (response.isClosed) {
                $("#statusTicket").val("4")
            }
            else if (response.isResponsed) {
                $("#statusTicket").val("3")
            }
            else if (response.isInprogress) {
                $("#statusTicket").val("2")
            }
            else if (response.isOpened) {
                $("#statusTicket").val("1")
            }

            $("#updateTicket").modal("toggle")

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")
            // $("#ticketCreation").modal("toggle")
            // $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()

        }
    });
}


function updateTicket(tagObj) {


    let payload = {
        "id": $("#ticketId").val(),
        "unitDepartmentId": $("#unitDepartmentIdTicket").val(),
        "response": $("#responseTicket").val(),
        "status": $("#statusTicket").val()
    }

    $(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'login.html';
    }

    $.ajax({
        url: "backend/api/ticket/update",
        method: "POST",
        headers: {
            Authorization: "Bearer " + access_token
        },
        contentType: "application/json", // Set the content type
        data: JSON.stringify(payload),
        success: function (response) {

            alert("انجام شد")
            getAllTicket()
            $("#updateTicket").modal("toggle")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            countTicket("open", "openedTicket");
            countTicket("inprogress", "inProgressingTicket");
            countTicket("responsed", "answeredTicket");
            countTicket("close", "closedTicket");

        },
        error: function (xhr, status, error) {

            alert("خطایی رخ داده است ")
            $(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
            $("#updateTicket").modal("toggle")

        }
    });
}