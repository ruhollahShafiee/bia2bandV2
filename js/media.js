function uploadMedia(mediaForm, successCallback, errorCallback) {

    let access_token = getCookie("access_token");
    if (access_token == undefined || access_token == "" || access_token == null) {
        location.href = 'index.html';
    }

    var form = new FormData(mediaForm);
    var settings = {
        "url": "backend/api/media/save",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + access_token
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "beforeSend": function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $("meta[name='_csrf']").attr("content"));
        },
        "data": form
    };

    $.ajax(settings).done(function (response) {

        successCallback(response)

    })
        .fail(function (error) {
            errorCallback(error)

        });

}


function findMediaByIds(mediaIds, successCallback, errorCallback) {

    let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'index.html';
	}

	$.ajax({
		url: "backend/api/media/findByIds",
		method: "POST",
		headers: {
			Authorization: "Bearer " + access_token
		},
		contentType: "application/json", // Set the content type
		data: JSON.stringify(mediaIds),
		success: function (response) {
			successCallback(response)
		},
		error: function (xhr, status, error) {
            errorCallback(error)
		}
	});
}