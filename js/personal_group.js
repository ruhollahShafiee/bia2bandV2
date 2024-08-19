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


	// buildYear("brithYear", 1346, 1400);
	// buildCityOption();
	// getAllCategories();

	if (window.location.href.split("#").length == 2) {
		if (window.location.href.split("#")[1].split("groupId=").length == 2) {
			$("#groupId").val(window.location.href.split("#")[1].split("groupId=")[1])
			getGroupInformation();
		}
	}

	getAllInstrumnet(null);
	getProfileInformation();


});



function addUserTogroup(username) {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}


	let groupID = $("#groupId").val()
	let payload = {
		"groupId": groupID,
		"username": username
	}

	$.ajax({
		url: "backend/api/groupv2/addUserToGroup",
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		contentType: "application/json", // Set the content type
		data: JSON.stringify(payload),
		success: function (response) {
			alert("انجام شد!")
			$("#modalLoadUser").modal("toggle")
			buildMembers(groupID, response);

		},
		error: function (xhr, status, error) {
			console.log(error)
		}
	});


}


function confrimTodelete(groupId, memberId) {
	$("#generalWarning").modal("toggle");
	$("#generalConfirmBtt").attr("onclick", "removeMemberFromGroup(" + groupId + "," + memberId + ")");
}

function removeMemberFromGroup(groupId, memberId) {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/groupv2/deleteMember/" + groupId + "/" + memberId,
		method: "DELETE",
		headers: {
			Authorization: "Bearer " + access_token
		},
		// contentType: "application/json", // Set the content type
		// data: JSON.stringify(payload),
		success: function (response) {
			alert("انجام شد!")
			$("#generalWarning").modal("toggle");
			buildMembers(groupId, response);

		},
		error: function (xhr, status, error) {
			console.log(error)
		}
	});
}

function buildMembers(groupId, members) {

	let element = '<div class="row">';

	let i = 0;

	for (let member of members) {

		if (i % 6 == 0) {
			element += '</div><div class="row">'
		}
		i++
		let profileImageUrl = "/assets/images/avatar.png"
		if (member.profile != null) {
			profileImageUrl = member.profile.mediaUrl;
		}
		element +=
			'<div class=" text-center col-md-2 col-xs-12">' +
			'<img src="' + profileImageUrl + '" class="rounded-circle mx-auto memberImageSize">' +
			'<p class="text-center iranYekanLightBold p_custom">' +
			member.firstname +
			'</p>' +
			'<i class="fa-solid fa-circle-minus bi bi-end-fill position-absolute fa-2x hover-shadow memberRemoveIcon" onclick="confrimTodelete(' + groupId + ', ' + member.id + ')"></i>' +
			'</div>'
	}
	element += "</div>"

	$("#memberdivs").empty()
	$("#memberdivs").append(element)
}

function getGroupInformation() {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/groupv2/getInfo/" + $("#groupId").val(),
		method: "GET",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {


			$("#groupId").val(response.id)
			$("#groupName").val(response.name)
			settupBackgroundProfile((response.background != null ? response.background.mediaUrl : null), (response.profile != null ? response.profile.mediaUrl : null))
			$("#createDurationGroup").val(response.createdPeriodTime)
			$("#facebookLink").val((response.facebookLink == null ? "" : response.facebookLink))
			$("#twitterLink").val((response.twitterLink == null ? "" : response.twitterLink))
			$("#instagramLinkOne").val((response.instagramLinkOne == null ? "" : response.instagramLinkOne))
			$("#instagramLinkTwo").val((response.instagramLinkTwo == null ? "" : response.instagramLinkTwo))
			$("#aboutMesasas").text((response.aboutGroup == null ? "" : response.aboutGroup))
			$("#extraDescription").text((response.extraDescription == null ? "" : response.extraDescription));

			if (response.confirmed == null || response.confirmed == false) {
				$("#groupConfirmed").css("display", "none");
				$("#groupConfirmedNot").css("display", "inline-block");
			}
			else {
				$("#groupConfirmedNot").css("display", "none");
				$("#groupConfirmed").css("display", "inline-block");
			}

			buildMembers(response.id, response.members)
			buidGroupMedia(response.medias, response.id)
			buildSkill(response.skills)
			if (response.skills != null && response.skills.length != 0) {
				loadSkill(response.skills[0].id)
			}

			buildWorkSample(response.skills, response.selectMediaIdsWorksamples)

			// if (haveSkill) {
			//     let skillMediaIds = []
			//     for (mediaIndex of response.skills[0].medias) {
			//         skillMediaIds.push(mediaIndex.id);
			//     }

			//     $("#mediasIdsId").val(JSON.stringify(skillMediaIds))
			// }

			// buildSkill(response.skills)



			// buildWorkSample((!haveSkill ? [] : response.skills), response.selectMediaIdsWorksamples)

			// $("#fullNamePV").empty();
			// $("#fullNamePV").append(response.firstname)

			// let skillName = ''
			// mainSkillVideos = []
			// if (response.skills != null) {

			//     for (skillIndex of response.skills) {
			//         if (skillIndex.isMainSkill == true) {
			//             skillName = skillIndex.category.name + " " + (skillIndex.instrument != null ? "(" + skillIndex.instrument.faName + ")" : (skillIndex.artStyle != null ? "(" + skillIndex.artStyle.faName + ")" : ""));

			//         }

			//     }

			// }
			// $("#skillAndCategoryName").empty();
			// $("#skillAndCategoryName").append(skillName);


		},
		error: function (xhr, status, error) {



		}
	});
}



function setGeneralInformation(targetObj) {

	let payload = {
		"id": ($("#groupId").val() == "" ? null : $("#groupId").val()),
		"name": $("#groupName").val(),
		"createTimePeriod": $("#createDurationGroup").val()
	}


	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/groupv2/addGeneralInformation",
		method: "POST",
		headers: {
			Authorization: "Bearer " + access_token
		},
		contentType: "application/json", // Set the content type
		data: JSON.stringify(payload),
		success: function (response) {
			$("#groupId").val(response)
			alert("انجام شد!")

		},
		error: function (xhr, status, error) {
			console.log(error)
		}
	});

}

function addMember(memberId) {
	let payload = {
		"id": ($("#groupId").val() == "" ? null : $("#groupId").val()),
		"name": $("#groupName").val(),
		"createTimePeriod": $("#createDurationGroup").val()
	}


	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/groupv2/addMember/" + memberId,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		contentType: "application/json", // Set the content type
		// data: JSON.stringify(payload),
		success: function (response) {
			alert("انجام شد!")

		},
		error: function (xhr, status, error) {
			console.log(error)
		}
	});
}


function updateBackgroundForm(thisObj, backgroundMediaForm) {

	$(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
	uploadMedia(backgroundMediaForm,
		function successed(data) {
			updateBackground(JSON.parse(data).id)
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#exampleModal').modal('toggle')

		},
		function error(error) {
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#exampleModal').modal('toggle')
		})
}


function updateBackground(mediaId) {
	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	let groupId = $("#groupId").val();
	if (groupId == "" || groupId == undefined) {
		groupId = "0"
	}

	$.ajax({
		url: "backend/api/groupv2/update/background/" + groupId + "/" + mediaId,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

			$("#groupId").val(response["groupId"])
			settupBackgroundProfile(response["background"].mediaUrl, null);
		},
		error: function (xhr, status, error) {

			console.log(error)

		}
	});


}

function updateProfileForm(thisObj, profileForm) {

	$(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
	uploadMedia(profileForm,
		function successed(data) {
			updateProfile(JSON.parse(data).id)
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#exampleModal2').modal('toggle')
		},
		function error(error) {
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#exampleModal2').modal('toggle')
		})
}





function updateProfile(mediaId) {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	let groupId = $("#groupId").val();
	if (groupId == "" || groupId == undefined) {
		groupId = "0"
	}

	$.ajax({
		url: "backend/api/groupv2/update/profile/" + groupId + "/" + mediaId,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

			$("#groupId").val(response["groupId"])
			settupBackgroundProfile(null, response["profile"].mediaUrl);
		},
		error: function (xhr, status, error) {

			console.log(error)

		}
	});

}


function settupBackgroundProfile(backgroundUrl, profileUrl) {
	if (backgroundUrl != null && backgroundUrl != undefined) {
		$('#groupBackground').css('background-image', 'url("' + backgroundUrl + '")');
	}

	if (profileUrl != null && profileUrl != undefined) {
		$('#groupProfileImageId').attr('src', profileUrl);
	}
}



function addMediaFormTOGroup(thisObj, mediaForms) {

	$(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
	uploadMedia(mediaForms,
		function successed(data) {

			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#skillMediaOverview').modal('toggle')
			mediaIdsArr = JSON.parse(($("#mediasIdsId").val() == "" || $("#mediasIdsId").val() == "null" || $("#mediasIdsId").val() == null || $("#mediasIdsId").val() == undefined) ? '[]' : $("#mediasIdsId").val());
			mediaIdsArr.push(JSON.parse(data).id)
			$("#mediasIdsId").val(JSON.stringify(mediaIdsArr))
			addMedia2Group($("#groupId").val(), JSON.parse(data).id)

		},
		function error(error) {
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#skillMediaOverview').modal('toggle')
		})
}



function addMedia2Group(groupId, mediaId) {

	if (groupId == "" || groupId == undefined || groupId == null) {
		groupId = 0;
	}

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/groupv2/addMedia/" + groupId + "/" + mediaId,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

			$("#groupId").val(response["groupId"])
			buidGroupMedia(response["medias"], groupId)
			// buildWorkSample(response['skills'], response.selectedSample)

			// settupBackgroundProfile(null, response.mediaUrl);
		},
		error: function (xhr, status, error) {

			console.log(error)

		}
	});

}


function buidGroupMedia(medias, grpupId) {

	let videoDiv = "";
	let photoDiv = "";
	for (media of medias) {
		if (media.contentType != null && (media.contentType.includes("video"))) {
			videoDiv +=
				' <div class="mt-3" id="skill_video_' + media.id + '">' +
				'<i class="fa-solid fa-trash-can me-4 ms-2 mt-1  fa-1x float-end hover-shadow"' +
				'style="color: rgb(255, 255, 255);  position: absolute;  z-index: 10000;"' +
				'data-bs-toggle="modal" onclick="confirmToRemove(\'skill_video_' + media.id + '\',\'' + grpupId + '\',\'' + media.id + '\')"></i>' +
				'<div class="row">' +
				'<div class="ratio ratio-16x9">' +
				'<video style="border-radius: 0.9rem; border-width: 0px;"' +
				' controls="controls autoplay">' +
				'<source src="' + media.mediaUrl + '"' +
				' type="video/mp4" />' +
				'</video>' +

				'</div>' +
				'</div>' +
				'</div>';

			// '<div class="row">' +
			// 	'<div class="ratio ratio-16x9">' +
			// 	'<iframe style="border-radius: 0.9rem;" src="' + media.mediaUrl + '"' +
			// 	'title="" allowfullscreen></iframe>' +
			// 	'</div>' +
			// 	'</div>';

		}
		else {
			photoDiv +=
				'<div class="mt-3"  id="skill_image_' + media.id + '">' +
				'<i class="fa-solid fa-trash-can mt-1 me-4  ms-2 fa-1x float-end hover-shadow "' +
				'style="color: rgb(255, 255, 255);  position: absolute;  z-index: 10000;"' +
				' data-bs-toggle="modal" onclick="confirmToRemove(\'skill_image_' + media.id + '\',\'' + grpupId + '\',\'' + media.id + '\')"></i>' +
				'<img src="' + media.mediaUrl + '" ' +
				'style="border-radius: 0.9rem;height:11.4rem; width:100%;" title="" ' +
				'allowfullscreen="">' +
				'</div>';



		}
	}

	$("#videoGroup").empty();
	$("#videoGroup").append(videoDiv);

	$("#imageGroup").empty();
	$("#imageGroup").append(photoDiv);



}


function confirmToRemove(targetTagId, groupId, mediaId) {

	$("#generalConfirmBtt").attr("onclick", "$('#" + targetTagId + "').remove();deleteMediaFromGroup(" + groupId + ", " + mediaId + ");$('#generalWarning').modal('toggle');")
	$("#generalWarning").modal('toggle');

}



function deleteMediaFromGroup(groupId, mediaId) {

	let mediaIds = []
	for (mediaIdIndex of JSON.parse($("#mediasIdsId").val())) {
		if (mediaIdIndex != Number(mediaId)) {
			mediaIds.push(mediaIdIndex)
		}
	}

	$("#mediasIdsId").val(JSON.stringify(mediaIds))

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}
	let data = {
		"aboutMe": $("#aboutMesasas").val()
	}


	$.ajax({
		url: "backend/api/groupv2/deleteMedia/" + groupId + "/" + mediaId,
		method: "DELETE",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {
			// buildWorkSample(response, response.sMedia.selectedMedia)
		},
		error: function (xhr, status, error) {

		}
	});

}


function getAllInstrumnet(instrumnetId) {

	$.ajax({
		url: "backend/api/instrument/all",
		method: "get",
		// contentType: "application/json", // Set the content type
		success: function (response) {
			let optoins = '<option value=null >انتخاب کنید</option>';
			for (instrumnet of response) {
				optoins += '<option ' + (instrumnetId != null && instrumnet.id == instrumnetId ? 'selected="selected"' : '') + ' value="' + instrumnet.id + '">' + instrumnet.faName + '</option>'
			}
			$("#instrumentss").empty();
			$("#instrumentss").append(optoins);

		},
		error: function (xhr, status, error) {
			calbackError(error)

			console.error("Error fetching data:", error);
		}
	});

}


function addMediaFormTOSkill(thisObj, mediaForms) {

	$(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
	uploadMedia(mediaForms,
		function successed(data) {

			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#skillMediaToGroupOverview').modal('toggle')
			mediaIdsArr = JSON.parse(($("#mediasIdsIdV2").val() == "" || $("#mediasIdsIdV2").val() == "null" || $("#mediasIdsIdV2").val() == null || $("#mediasIdsIdV2").val() == undefined) ? '[]' : $("#mediasIdsIdV2").val());
			mediaIdsArr.push(JSON.parse(data).id)
			$("#mediasIdsIdV2").val(JSON.stringify(mediaIdsArr))
			addMedia2Skill($("#skillId").val(), JSON.parse(data).id)

		},
		function error(error) {
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#skillMediaToGroupOverview').modal('toggle')
		})
}

function addMedia2Skill(skillId, mediaId) {

	if (skillId == "" || skillId == undefined || skillId == null) {
		findMediaByIds(JSON.parse($("#mediasIdsIdV2").val()), function successCallback(data) {
			buidSkillMedia(data, '0')
		}, function errorCallback(error) { });

		return null;
	}

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/skill/addMediaToSkill/" + skillId + "/" + mediaId,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

			buidSkillMedia(response['skill'].media, skillId)
			// buildWorkSample(response['skills'], response.selectedSample)

			// settupBackgroundProfile(null, response.mediaUrl);
		},
		error: function (xhr, status, error) {

			console.log(error)

		}
	});

}

function buidSkillMedia(medias, skillId) {

	let videoDiv = "";
	let photoDiv = "";
	for (media of medias) {
		if (media.contentType != null && (media.contentType.includes("video"))) {
			videoDiv +=
				' <div class="mt-3" id="skill_video_' + media.id + '">' +
				'<i class="fa-solid fa-trash-can me-4 ms-2 mt-1  fa-1x float-end hover-shadow"' +
				'style="color: rgb(255, 255, 255);  position: absolute;  z-index: 10000;"' +
				'data-bs-toggle="modal" onclick="confirmToRemoveSkillMedia(\'skill_video_' + media.id + '\',\'' + skillId + '\',\'' + media.id + '\')"></i>' +
				'<div class="row">' +
				'<div class="ratio ratio-16x9">' +
				'<video style="border-radius: 0.9rem; border-width: 0px;"' +
				' controls="controls autoplay">' +
				'<source src="' + media.mediaUrl + '"' +
				' type="video/mp4" />' +
				'</video>' +

				'</div>' +
				'</div>' +
				'</div>';

			// '<div class="row">' +
			// 	'<div class="ratio ratio-16x9">' +
			// 	'<iframe style="border-radius: 0.9rem;" src="' + media.mediaUrl + '"' +
			// 	'title="" allowfullscreen></iframe>' +
			// 	'</div>' +
			// 	'</div>';

		}
		else {
			photoDiv +=
				'<div class="mt-3"  id="skill_image_' + media.id + '">' +
				'<i class="fa-solid fa-trash-can mt-1 me-4  ms-2 fa-1x float-end hover-shadow "' +
				'style="color: rgb(255, 255, 255);  position: absolute;  z-index: 10000;"' +
				' data-bs-toggle="modal" onclick="confirmToRemoveSkillMedia(\'skill_image_' + media.id + '\',\'' + skillId + '\',\'' + media.id + '\')"></i>' +
				'<img src="' + media.mediaUrl + '" ' +
				'style="border-radius: 0.9rem;height:11.4rem; width:100%;" title="" ' +
				'allowfullscreen="">' +
				'</div>';



		}
	}

	$("#videoSkill").empty();
	$("#videoSkill").append(videoDiv);

	$("#imageSkill").empty();
	$("#imageSkill").append(photoDiv);



}


function saveSkill(isNew) {
	let skillId = (isNew ? null : ($("#skillId").val() == "" || $("#skillId").val() == undefined ? null : $("#skillId").val()));
	let categoryId = 2003;
	let instrumnetId = $('#instrumentss').val();
	let workExperienceYears = $("#workExperienceYears").val();
	let artStyleId = $("#artStyle").val();
	let mediaIds = JSON.parse($("#mediasIdsIdV2").val());

	let payload = {
		"id": skillId,
		"categoryId": categoryId,
		"instrumentId": instrumnetId,
		"workExperienceYears": workExperienceYears,
		"mediaIds": mediaIds,
		"artStyleId": artStyleId,
		"artistId": null,
		"groupId": $("#groupId").val()
	}


	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/skill/add",
		method: "POST",
		headers: {
			Authorization: "Bearer " + access_token
		},
		contentType: "application/json", // Set the content type
		data: JSON.stringify(payload),
		success: function (response) {
			$("#skillId").val(response.id)
			buildSkill(response.skills)

		},
		error: function (xhr, status, error) {
			alert(error)
		}
	});

}


function buildSkill(skills) {


	if (skills == null || skills == undefined)
		return

	let rowSkill = "";


	for (skill of skills) {
		let idss = skill.id + "rrrrrrrrrr"
		rowSkill += '<tr id="' + idss + '">' +
			'<td>' + 'گروه های موسیقی' + '</td>' +
			'<td>' + (skill.artStyle == null ? '--' : skill.artStyle.faName) + '</td>' +
			'<td>' + (skill.instrument == null ? '--' : skill.instrument.faName) + '</td>' +
			'<td>' + skill.workExperienceYears + '</td>' +
			'<td class="d-flex">' +
			'<a class="nav-link" onclick="loadSkill(' + skill.id + ')"  href="javascript:void(0);">ویرایش</a>' +
			'</td>' +
			'<td>' +
			'<a class="nav-link"  onclick="removeSkillV2(\'' + idss + '\',' + skill.id + ')" href="javascript:void(0);">حذف</a>' +
			'</td>' +
			'</tr>';
	}

	$("#listSkillstBody").empty()
	$("#listSkillstBody").append(rowSkill)
	// buildWorkSample((skills.length != 0 ? skills : []), null)

}


function loadSkill(skillId) {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$('#mediasIdsIdV2').val('[]');

	$.ajax({
		url: "backend/api/skill/findById/" + skillId,
		method: "GET",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {
			$("#categorySelect").val(2003)
			// $('#categorySelect option[value=' + (response.category == null ? 0 : response.category.id) + ']').attr('selected', 'selected');
			getAllInstrumnet((response.instrument == null ? null : response.instrument.id));

			$("#skillId").val(response.id)
			$("#workExperienceYears").val(response.workExperienceYears)
			if (response.informationQuestions == null || response.informationQuestions.length == 0) {
				buildTemplateQuestion(2003)

			}
			else {
				buildQuestions(response.informationQuestions)

			}

			buidSkillMedia(response.medias, response.id)

		},
		error: function (xhr, status, error) {

		}
	});
}


function buildTemplateQuestion(categorId) {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/informationQuestionTemplate/allByCategoryId/" + categorId,
		method: "GET",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

			let questionsDiv = "";
			let questions = response;

			for (question of questions) {

				questionsDiv += '<div class="col-md-12 mt-4">' +
					'<div class="row">' +
					'<div class="col-md-12 col-xs-12">' +
					'<div class="row">' +
					'<p class="iranYekanLightBold p_custom">' +
					question.question +
					'</p>' +
					'</div>';

				let question_answer_id = question.id + '_0';
				let questionTargetMedia = 'questionsMedia_' + question_answer_id
				questionsDiv += '<div class="row mt-3">' +
					'<div class="col-md-2 pt-3 d-flex">' +
					'<div class="form-check form-check-inline">' +
					'<input onclick="toggleCheck($(this))" id="nothave_' + question_answer_id + '"' +
					' class="form-check-input" checked value=false type="checkbox">' +
					'<label class="form-check-label p_custom iranYekanLightBold"' +
					' for="masterCheckNo">ندارم</label>' +
					'</div>' +
					'<div class="form-check form-check-inline">' +
					'<input type="hidden" id="hidden_have_' + question_answer_id + '"/>' +
					'<input onclick="toggleCheck($(this))"  id="have_' + question_answer_id + '"' +
					' class="form-check-input"  value=true type="checkbox">' +
					'<label class="form-check-label p_custom iranYekanLightBold"' +
					' for="masterCheckYes">دارم</label>' +
					'</div>' +
					'</div>' +
					'<div class="col-md-4 pe-4 margin-top-1rem">' +
					'<input type="text" id="answer_' + question_answer_id + '"  class="form-control iranYekanLight inputHeight"' +
					' id="facebookLink" placeholder="--">' +
					'</div>' +
					'<div class="col-md-1 px-0  adding_plus mx-auto">' +
					'<button id="click_' + question_answer_id + '" onclick="saveOrUpdateAnswer(' + question.id + ',\'' + question_answer_id + '\',true)" type="button" class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
					// '<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
					'<span class="p_custom ps-1 mx-auto">' +
					'ثبت' +
					'</span>' +
					'</button>' +
					'</div>' +
					'<div class="col-md-4 pt-2">' +
					'<button id="prepareUploadMedia_' + question_answer_id + '" type="button" onclick="prepareUploadMedia(\'' + question_answer_id + '\',0,true)" class="btn btn-outline-secondary w-100 border-dotted5 d-flex">' +
					'<span class="p_custom ms-auto mt-1">' +
					'آپلود تصویر یا فایل ضمیمه' +
					'</span>' +
					'<span role="img" aria-label="double-left"' +
					' class="anticon anticon-double-left me-2 ps-3 ms-2">' +
					'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"' +
					'xmlns="http://www.w3.org/2000/svg">' +
					'<path ' +
					'd="M12.1476 10.7577C12.1301 10.7353 12.1076 10.7172 12.0821 10.7047C12.0565 10.6923 12.0284 10.6858 11.9999 10.6858C11.9715 10.6858 11.9434 10.6923 11.9178 10.7047C11.8922 10.7172 11.8698 10.7353 11.8523 10.7577L9.22728 14.0788C9.20564 14.1065 9.19221 14.1396 9.18853 14.1745C9.18485 14.2094 9.19107 14.2447 9.20647 14.2762C9.22187 14.3078 9.24584 14.3343 9.27563 14.3529C9.30542 14.3714 9.33983 14.3812 9.37493 14.3812H11.107V20.0624C11.107 20.1655 11.1913 20.2499 11.2945 20.2499H12.7007C12.8038 20.2499 12.8882 20.1655 12.8882 20.0624V14.3835H14.6249C14.782 14.3835 14.8687 14.203 14.7726 14.0812L12.1476 10.7577Z"' +
					' fill="black" />' +
					'<path' +
					' d="M19.0172 8.59453C17.9438 5.76328 15.2086 3.75 12.0047 3.75C8.80078 3.75 6.06563 5.76094 4.99219 8.59219C2.98359 9.11953 1.5 10.95 1.5 13.125C1.5 15.7148 3.59766 17.8125 6.18516 17.8125H7.125C7.22813 17.8125 7.3125 17.7281 7.3125 17.625V16.2188C7.3125 16.1156 7.22813 16.0312 7.125 16.0312H6.18516C5.39531 16.0312 4.65234 15.7172 4.09922 15.1477C3.54844 14.5805 3.25547 13.8164 3.28125 13.0242C3.30234 12.4055 3.51328 11.8242 3.89531 11.3344C4.28672 10.8352 4.83516 10.4719 5.44453 10.3102L6.33281 10.0781L6.65859 9.22031C6.86016 8.68594 7.14141 8.18672 7.49531 7.73438C7.8447 7.28603 8.25857 6.89191 8.72344 6.56484C9.68672 5.8875 10.8211 5.52891 12.0047 5.52891C13.1883 5.52891 14.3227 5.8875 15.2859 6.56484C15.7523 6.89297 16.1648 7.28672 16.5141 7.73438C16.868 8.18672 17.1492 8.68828 17.3508 9.22031L17.6742 10.0758L18.5602 10.3102C19.8305 10.6523 20.7188 11.8078 20.7188 13.125C20.7188 13.9008 20.4164 14.632 19.868 15.1805C19.599 15.451 19.2791 15.6655 18.9266 15.8115C18.5742 15.9576 18.1963 16.0323 17.8148 16.0312H16.875C16.7719 16.0312 16.6875 16.1156 16.6875 16.2188V17.625C16.6875 17.7281 16.7719 17.8125 16.875 17.8125H17.8148C20.4023 17.8125 22.5 15.7148 22.5 13.125C22.5 10.9523 21.0211 9.12422 19.0172 8.59453Z"' +
					' fill="black" />' +
					'</svg>' +
					'</span>' +
					'</button>' +
					'</div>' +
					'  <div class="col-md-1 px-0  adding_plus mx-auto">' +
					'<button id="click_1003_1009" onclick="addExtraAnswer($(this),\'' + 0 + '\')"' +
					'type="button"' +
					'class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
					'<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
					'<span class="p_custom ps-1">' +
					'افزودن' +
					'</span>' +
					'</button>' +
					'</div>' +
					'</div>' +
					'<div class="col-md-12 col-xs-12" id="' + questionTargetMedia + '"></div>' +
					'</div>' +
					'</div>';


				questionsDiv += '</div>';


			}

			$("#questionsDiv").empty();
			$("#questionsDiv").append(questionsDiv);
		},
		error: function (xhr, status, error) {

		}
	});

}


function removeSkillV2(thisObject, skillId) {

	$("#ConfirmPopUpBtn").attr("onclick", "removeSkill('" + thisObject + "', " + skillId + ")");
	$("#ConfirmPopUp").modal("toggle");
}

function removeSkill(thisObject, skillId) {


	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/skill/remove/" + skillId,
		method: "DELETE",
		headers: {
			Authorization: "Bearer " + access_token
		},
		// contentType: "application/json", // Set the content type
		// data: JSON.stringify(payload),
		success: function (response) {
			if ($("#" + thisObject).parent().children().length == 1) {
				$("#skillId").val("")
				$("#mediasIdsId").val(JSON.stringify([]))
				$("#videoSkill").empty()
				$("#imageSkill").empty()
				$("#workExperienceYears").val("")
				$("#flexSwitchCheckDefault").prop('checked', false);
				$("#artStyle").val("null")
				$("#categorySelect").val("null")
				$("#workSamplesDiv").empty()
				$("#questionsDiv").empty();
			}
			$("#" + thisObject).remove()
			$("#ConfirmPopUp").modal("toggle");

		},
		error: function (xhr, status, error) {

		}
	});
}


function confirmToRemoveSkillMedia(targetTagId, skillId, mediaId) {

	$("#generalConfirmBtt").attr("onclick", "$('#" + targetTagId + "').remove();deleteMediaFromSkill(" + skillId + ", " + mediaId + ");$('#generalWarning').modal('toggle');")
	$("#generalWarning").modal('toggle');

}

function deleteMediaFromSkill(skillId, mediaId) {

	let mediaIds = []
	for (mediaIdIndex of JSON.parse($("#mediasIdsId").val())) {
		if (mediaIdIndex != Number(mediaId)) {
			mediaIds.push(mediaIdIndex)
		}
	}

	$("#mediasIdsId").val(JSON.stringify(mediaIds))

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}
	let data = {
		"aboutMe": $("#aboutMesasas").val()
	}


	$.ajax({
		url: "backend/api/skill/deleteMedia/" + skillId + "/" + mediaId,
		method: "DELETE",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {
			buildWorkSample(response['skills'], response.sMedia.selectedMedia)
		},
		error: function (xhr, status, error) {

		}
	});

}


function toggleCheck(clickedObj) {
	if ($(clickedObj).prop("checked")) {
		if ($(clickedObj).attr("id").includes("nothave")) {
			$("#" + $(clickedObj).attr("id").replace("nothave", "hidden_have")).val(false)
			$("#" + $(clickedObj).attr("id").replace("nothave", "have")).prop('checked', false)
			$("#" + $(clickedObj).attr("id")).prop('checked', true)
		}
		else {
			$("#" + $(clickedObj).attr("id").replace("have", "hidden_have")).val(true)
			$("#" + $(clickedObj).attr("id").replace("have", "nothave")).prop('checked', false)
			$("#" + $(clickedObj).attr("id")).prop('checked', true)
		}
	}
	else {
		if ($(clickedObj).attr("id").includes("nothave")) {
			$("#" + $(clickedObj).attr("id").replace("nothave", "hidden_have")).val(true)
			$("#" + $(clickedObj).attr("id").replace("nothave", "have")).prop('checked', true)
			$("#" + $(clickedObj).attr("id")).prop('checked', false)
		}
		else {
			$("#" + $(clickedObj).attr("id").replace("have", "hidden_have")).val(false)
			$("#" + $(clickedObj).attr("id").replace("have", "nothave")).prop('checked', true)
			$("#" + $(clickedObj).attr("id")).prop('checked', false)
		}
	}

}


function saveOrUpdateAnswer(questionId, anserId, isNew) {
	let haveFlag = $("#hidden_have_" + anserId).val();
	if (haveFlag == "") {
		haveFlag = false;
	}
	let answer = $("#answer_" + anserId).val();

	let data = {
		"questionId": questionId,
		"answerId": anserId.split("_")[anserId.split("_").length - 1],
		"haveFlag": haveFlag,
		"answer": answer,
		"skillId": $("#skillId").val()
	}

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	let urlvar = "backend/api/answer/update/answer"
	if (isNew) {
		urlvar = "backend/api/answer/update/newQuestion/answer"
	}

	$.ajax({
		url: urlvar,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		data: JSON.stringify(data),
		contentType: "application/json", // Set the content type
		success: function (response) {
			$("#hidden_have_" + anserId).attr("id", "hidden_have_" + questionId + "_" + response);
			$("#answer_" + anserId).attr("id", "answer_" + questionId + "_" + response);
			$("#nothave_" + anserId).attr("id", "nothave_" + questionId + "_" + response);
			$("#questionsMedia_" + anserId).attr("id", "questionsMedia_" + questionId + "_" + response);
			$("#prepareUploadMedia_" + anserId).attr("onclick", "prepareUploadMedia('" + questionId + "_" + response + "'," + response + ")");
			$("#prepareUploadMedia_" + anserId).attr("id", "prepareUploadMedia_" + questionId + "_" + response);
			$("#have_" + anserId).attr("id", "have_" + questionId + "_" + response);
			$("#click_" + anserId).attr("onclick", "saveOrUpdateAnswer(" + questionId + ",'" + questionId + "_" + response + "',false)");
			$("#click_" + anserId).attr("id", "click_" + questionId + "_" + response);
			alert("انجام شد!")
		},
		error: function (xhr, status, error) {

			console.log(error)

		}
	});
}

function buildQuestions(questions) {

	let questionsDiv = "";
	let mediaObject = {}

	for (question of questions) {


		questionsDiv += '<div class="col-md-12 mt-4">' +
			'<div class="row">' +
			'<div class="col-md-12 col-xs-12">' +
			'<div class="row">' +
			'<p class="iranYekanLightBold p_custom">' +
			question.question +
			'</p>' +
			'</div>';

		if (question.informationAnswers == null || question.informationAnswers == undefined || question.informationAnswers.length == 0) {
			let question_answer_id = question.id + '_0';
			let questionTargetMedia = 'questionsMedia_' + question_answer_id
			questionsDiv += '<div class="row mt-3">' +
				'<div class="col-md-2 pt-3 d-flex">' +
				'<div class="form-check form-check-inline">' +
				'<input onclick="toggleCheck($(this))" id="nothave_' + question_answer_id + '"' +
				' class="form-check-input" checked value=false type="checkbox">' +
				'<label class="form-check-label p_custom iranYekanLightBold"' +
				' for="masterCheckNo">ندارم</label>' +
				'</div>' +
				'<div class="form-check form-check-inline">' +
				'<input type="hidden" id="hidden_have_' + question_answer_id + '"/>' +
				'<input onclick="toggleCheck($(this))"  id="have_' + question_answer_id + '"' +
				' class="form-check-input"  value=true type="checkbox">' +
				'<label class="form-check-label p_custom iranYekanLightBold"' +
				' for="masterCheckYes">دارم</label>' +
				'</div>' +
				'</div>' +
				'<div class="col-md-4 pe-4 margin-top-1rem">' +
				'<input type="text" id="answer_' + question_answer_id + '"  class="form-control iranYekanLight inputHeight"' +
				' id="facebookLink" placeholder="--">' +
				'</div>' +
				'<div class="col-md-1 px-0  adding_plus mx-auto">' +
				'<button id="click_' + question_answer_id + '" onclick="saveOrUpdateAnswer(' + question.id + ',\'' + question_answer_id + '\',false)" type="button" class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
				// '<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
				'<span class="p_custom ps-1 mx-auto">' +
				'ثبت' +
				'</span>' +
				'</button>' +
				'</div>' +
				'<div class="col-md-4 pt-2">' +
				'<button id="prepareUploadMedia_' + question_answer_id + '" type="button" onclick="prepareUploadMedia(\'' + question_answer_id + '\',0,false)" class="btn btn-outline-secondary w-100 border-dotted5 d-flex">' +
				'<span class="p_custom ms-auto mt-1">' +
				'آپلود تصویر یا فایل ضمیمه' +
				'</span>' +
				'<span role="img" aria-label="double-left"' +
				' class="anticon anticon-double-left me-2 ps-3 ms-2">' +
				'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"' +
				'xmlns="http://www.w3.org/2000/svg">' +
				'<path ' +
				'd="M12.1476 10.7577C12.1301 10.7353 12.1076 10.7172 12.0821 10.7047C12.0565 10.6923 12.0284 10.6858 11.9999 10.6858C11.9715 10.6858 11.9434 10.6923 11.9178 10.7047C11.8922 10.7172 11.8698 10.7353 11.8523 10.7577L9.22728 14.0788C9.20564 14.1065 9.19221 14.1396 9.18853 14.1745C9.18485 14.2094 9.19107 14.2447 9.20647 14.2762C9.22187 14.3078 9.24584 14.3343 9.27563 14.3529C9.30542 14.3714 9.33983 14.3812 9.37493 14.3812H11.107V20.0624C11.107 20.1655 11.1913 20.2499 11.2945 20.2499H12.7007C12.8038 20.2499 12.8882 20.1655 12.8882 20.0624V14.3835H14.6249C14.782 14.3835 14.8687 14.203 14.7726 14.0812L12.1476 10.7577Z"' +
				' fill="black" />' +
				'<path' +
				' d="M19.0172 8.59453C17.9438 5.76328 15.2086 3.75 12.0047 3.75C8.80078 3.75 6.06563 5.76094 4.99219 8.59219C2.98359 9.11953 1.5 10.95 1.5 13.125C1.5 15.7148 3.59766 17.8125 6.18516 17.8125H7.125C7.22813 17.8125 7.3125 17.7281 7.3125 17.625V16.2188C7.3125 16.1156 7.22813 16.0312 7.125 16.0312H6.18516C5.39531 16.0312 4.65234 15.7172 4.09922 15.1477C3.54844 14.5805 3.25547 13.8164 3.28125 13.0242C3.30234 12.4055 3.51328 11.8242 3.89531 11.3344C4.28672 10.8352 4.83516 10.4719 5.44453 10.3102L6.33281 10.0781L6.65859 9.22031C6.86016 8.68594 7.14141 8.18672 7.49531 7.73438C7.8447 7.28603 8.25857 6.89191 8.72344 6.56484C9.68672 5.8875 10.8211 5.52891 12.0047 5.52891C13.1883 5.52891 14.3227 5.8875 15.2859 6.56484C15.7523 6.89297 16.1648 7.28672 16.5141 7.73438C16.868 8.18672 17.1492 8.68828 17.3508 9.22031L17.6742 10.0758L18.5602 10.3102C19.8305 10.6523 20.7188 11.8078 20.7188 13.125C20.7188 13.9008 20.4164 14.632 19.868 15.1805C19.599 15.451 19.2791 15.6655 18.9266 15.8115C18.5742 15.9576 18.1963 16.0323 17.8148 16.0312H16.875C16.7719 16.0312 16.6875 16.1156 16.6875 16.2188V17.625C16.6875 17.7281 16.7719 17.8125 16.875 17.8125H17.8148C20.4023 17.8125 22.5 15.7148 22.5 13.125C22.5 10.9523 21.0211 9.12422 19.0172 8.59453Z"' +
				' fill="black" />' +
				'</svg>' +
				'</span>' +
				'</button>' +
				'</div>' +
				'  <div class="col-md-1 px-0  adding_plus mx-auto">' +
				'<button id="click_1003_1009" onclick="addExtraAnswer($(this),\'' + question.id + '\')"' +
				'type="button"' +
				'class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
				'<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
				'<span class="p_custom ps-1">' +
				'افزودن' +
				'</span>' +
				'</button>' +
				'</div>' +
				'</div>' +
				'<div class="col-md-12 col-xs-12" id="' + questionTargetMedia + '"></div>' +
				'</div>' +
				'</div>';

		}
		for (answerIndex of question.informationAnswers) {
			let question_answer_id = question.id + '_' + answerIndex.id;
			let questionTargetMedia = 'questionsMedia_' + question_answer_id
			mediaObject[question_answer_id] = answerIndex.medias;
			questionsDiv += '<div class="row mt-3">' +
				'<div class="col-md-2 pt-3 d-flex">' +
				'<div class="form-check form-check-inline">' +
				'<input onclick="toggleCheck($(this))" id="nothave_' + question_answer_id + '"' +
				' class="form-check-input" ' + (!answerIndex.have ? "checked" : '') + ' value=false type="checkbox">' +
				'<label class="form-check-label p_custom iranYekanLightBold"' +
				' for="masterCheckNo">ندارم</label>' +
				'</div>' +
				'<div class="form-check form-check-inline">' +
				'<input type="hidden" id="hidden_have_' + question_answer_id + '"/>' +
				'<input onclick="toggleCheck($(this))"  id="have_' + question_answer_id + '"' +
				' class="form-check-input" ' + (answerIndex.have ? "checked" : '') + ' value=true type="checkbox">' +
				'<label class="form-check-label p_custom iranYekanLightBold"' +
				' for="masterCheckYes">دارم</label>' +
				'</div>' +
				'</div>' +
				'<div class="col-md-4 pe-4 margin-top-1rem">' +
				'<input type="text" id="answer_' + question_answer_id + '" ' + 'value=' + (answerIndex.answer != null ? '"' + answerIndex.answer + '"' : "\'\'") + ' class="form-control iranYekanLight inputHeight"' +
				' id="facebookLink" placeholder="--">' +
				'</div>' +
				'<div class="col-md-1 px-0  adding_plus mx-auto">' +
				'<button id="click_' + question_answer_id + '" onclick="saveOrUpdateAnswer(' + question.id + ',\'' + question_answer_id + '\',false)" type="button" class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
				// '<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
				'<span class="p_custom ps-1 mx-auto">' +
				'ثبت' +
				'</span>' +
				'</button>' +
				'</div>' +
				'<div class="col-md-4 pt-2">' +
				'<button id="prepareUploadMedia_' + question_answer_id + '" type="button" onclick="prepareUploadMedia(\'' + question_answer_id + '\',' + answerIndex.id + ',false)" class="btn btn-outline-secondary w-100 border-dotted5 d-flex">' +
				'<span class="p_custom ms-auto mt-1">' +
				'آپلود تصویر یا فایل ضمیمه' +
				'</span>' +
				'<span role="img" aria-label="double-left"' +
				' class="anticon anticon-double-left me-2 ps-3 ms-2">' +
				'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"' +
				'xmlns="http://www.w3.org/2000/svg">' +
				'<path ' +
				'd="M12.1476 10.7577C12.1301 10.7353 12.1076 10.7172 12.0821 10.7047C12.0565 10.6923 12.0284 10.6858 11.9999 10.6858C11.9715 10.6858 11.9434 10.6923 11.9178 10.7047C11.8922 10.7172 11.8698 10.7353 11.8523 10.7577L9.22728 14.0788C9.20564 14.1065 9.19221 14.1396 9.18853 14.1745C9.18485 14.2094 9.19107 14.2447 9.20647 14.2762C9.22187 14.3078 9.24584 14.3343 9.27563 14.3529C9.30542 14.3714 9.33983 14.3812 9.37493 14.3812H11.107V20.0624C11.107 20.1655 11.1913 20.2499 11.2945 20.2499H12.7007C12.8038 20.2499 12.8882 20.1655 12.8882 20.0624V14.3835H14.6249C14.782 14.3835 14.8687 14.203 14.7726 14.0812L12.1476 10.7577Z"' +
				' fill="black" />' +
				'<path' +
				' d="M19.0172 8.59453C17.9438 5.76328 15.2086 3.75 12.0047 3.75C8.80078 3.75 6.06563 5.76094 4.99219 8.59219C2.98359 9.11953 1.5 10.95 1.5 13.125C1.5 15.7148 3.59766 17.8125 6.18516 17.8125H7.125C7.22813 17.8125 7.3125 17.7281 7.3125 17.625V16.2188C7.3125 16.1156 7.22813 16.0312 7.125 16.0312H6.18516C5.39531 16.0312 4.65234 15.7172 4.09922 15.1477C3.54844 14.5805 3.25547 13.8164 3.28125 13.0242C3.30234 12.4055 3.51328 11.8242 3.89531 11.3344C4.28672 10.8352 4.83516 10.4719 5.44453 10.3102L6.33281 10.0781L6.65859 9.22031C6.86016 8.68594 7.14141 8.18672 7.49531 7.73438C7.8447 7.28603 8.25857 6.89191 8.72344 6.56484C9.68672 5.8875 10.8211 5.52891 12.0047 5.52891C13.1883 5.52891 14.3227 5.8875 15.2859 6.56484C15.7523 6.89297 16.1648 7.28672 16.5141 7.73438C16.868 8.18672 17.1492 8.68828 17.3508 9.22031L17.6742 10.0758L18.5602 10.3102C19.8305 10.6523 20.7188 11.8078 20.7188 13.125C20.7188 13.9008 20.4164 14.632 19.868 15.1805C19.599 15.451 19.2791 15.6655 18.9266 15.8115C18.5742 15.9576 18.1963 16.0323 17.8148 16.0312H16.875C16.7719 16.0312 16.6875 16.1156 16.6875 16.2188V17.625C16.6875 17.7281 16.7719 17.8125 16.875 17.8125H17.8148C20.4023 17.8125 22.5 15.7148 22.5 13.125C22.5 10.9523 21.0211 9.12422 19.0172 8.59453Z"' +
				' fill="black" />' +
				'</svg>' +
				'</span>' +
				'</button>' +
				'</div>' +
				'  <div class="col-md-1 px-0  adding_plus mx-auto">' +
				'<button id="click_1003_1009" onclick="addExtraAnswer($(this),\'' + question.id + '\')"' +
				' type="button"' +
				' class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
				'<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
				'<span class="p_custom ps-1">' +
				'افزودن' +
				'</span>' +
				'</button>' +
				'</div>' +
				'</div>' +
				'<div class="col-md-12 col-xs-12" id="' + questionTargetMedia + '"></div>' +
				'</div>' +

				'</div>';


		}

		questionsDiv += '</div>';


	}

	$("#questionsDiv").empty();
	$("#questionsDiv").append(questionsDiv);

	buildQuestionMedia(mediaObject)


}


function addExtraAnswer(thisObj, questionId) {

	let isNew = false;
	if (questionId == '0') {
		isNew = true;
	}
	let question_answer_id = questionId + '_0';
	let questionTargetMedia = 'questionsMedia_' + question_answer_id
	// mediaObject[question_answer_id] = answerIndex.medias;
	qDiv = '<div class="row mt-3">' +
		'<div class="col-md-2 pt-3 d-flex">' +
		'<div class="form-check form-check-inline">' +
		'<input onclick="toggleCheck($(this))" id="nothave_' + question_answer_id + '"' +
		' class="form-check-input" checked value=false type="checkbox">' +
		'<label class="form-check-label p_custom iranYekanLightBold"' +
		' for="masterCheckNo">ندارم</label>' +
		'</div>' +
		'<div class="form-check form-check-inline">' +
		'<input type="hidden" id="hidden_have_' + question_answer_id + '"/>' +
		'<input onclick="toggleCheck($(this))"  id="have_' + question_answer_id + '"' +
		' class="form-check-input" value=true type="checkbox">' +
		'<label class="form-check-label p_custom iranYekanLightBold"' +
		' for="masterCheckYes">دارم</label>' +
		'</div>' +
		'</div>' +
		'<div class="col-md-4 pe-4 margin-top-1rem">' +
		'<input type="text" id="answer_' + question_answer_id + '"  class="form-control iranYekanLight inputHeight"' +
		' id="facebookLink" placeholder="--">' +
		'</div>' +
		'<div class="col-md-1 px-0  adding_plus mx-auto">' +
		'<button id="click_' + question_answer_id + '" onclick="saveOrUpdateAnswer(' + questionId + ',\'' + question_answer_id + '\',' + isNew + ')" type="button" class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
		// '<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
		'<span class="p_custom ps-1 mx-auto">' +
		'ثبت' +
		'</span>' +
		'</button>' +
		'</div>' +
		'<div class="col-md-4 pt-2">' +
		'<button id="prepareUploadMedia_' + question_answer_id + '" type="button" onclick="prepareUploadMedia(\'' + question_answer_id + '\',' + 0 + ', ' + isNew + ')" class="btn btn-outline-secondary w-100 border-dotted5 d-flex">' +
		'<span class="p_custom ms-auto mt-1">' +
		'آپلود تصویر یا فایل ضمیمه' +
		'</span>' +
		'<span role="img" aria-label="double-left"' +
		' class="anticon anticon-double-left me-2 ps-3 ms-2">' +
		'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"' +
		'xmlns="http://www.w3.org/2000/svg">' +
		'<path ' +
		'd="M12.1476 10.7577C12.1301 10.7353 12.1076 10.7172 12.0821 10.7047C12.0565 10.6923 12.0284 10.6858 11.9999 10.6858C11.9715 10.6858 11.9434 10.6923 11.9178 10.7047C11.8922 10.7172 11.8698 10.7353 11.8523 10.7577L9.22728 14.0788C9.20564 14.1065 9.19221 14.1396 9.18853 14.1745C9.18485 14.2094 9.19107 14.2447 9.20647 14.2762C9.22187 14.3078 9.24584 14.3343 9.27563 14.3529C9.30542 14.3714 9.33983 14.3812 9.37493 14.3812H11.107V20.0624C11.107 20.1655 11.1913 20.2499 11.2945 20.2499H12.7007C12.8038 20.2499 12.8882 20.1655 12.8882 20.0624V14.3835H14.6249C14.782 14.3835 14.8687 14.203 14.7726 14.0812L12.1476 10.7577Z"' +
		' fill="black" />' +
		'<path' +
		' d="M19.0172 8.59453C17.9438 5.76328 15.2086 3.75 12.0047 3.75C8.80078 3.75 6.06563 5.76094 4.99219 8.59219C2.98359 9.11953 1.5 10.95 1.5 13.125C1.5 15.7148 3.59766 17.8125 6.18516 17.8125H7.125C7.22813 17.8125 7.3125 17.7281 7.3125 17.625V16.2188C7.3125 16.1156 7.22813 16.0312 7.125 16.0312H6.18516C5.39531 16.0312 4.65234 15.7172 4.09922 15.1477C3.54844 14.5805 3.25547 13.8164 3.28125 13.0242C3.30234 12.4055 3.51328 11.8242 3.89531 11.3344C4.28672 10.8352 4.83516 10.4719 5.44453 10.3102L6.33281 10.0781L6.65859 9.22031C6.86016 8.68594 7.14141 8.18672 7.49531 7.73438C7.8447 7.28603 8.25857 6.89191 8.72344 6.56484C9.68672 5.8875 10.8211 5.52891 12.0047 5.52891C13.1883 5.52891 14.3227 5.8875 15.2859 6.56484C15.7523 6.89297 16.1648 7.28672 16.5141 7.73438C16.868 8.18672 17.1492 8.68828 17.3508 9.22031L17.6742 10.0758L18.5602 10.3102C19.8305 10.6523 20.7188 11.8078 20.7188 13.125C20.7188 13.9008 20.4164 14.632 19.868 15.1805C19.599 15.451 19.2791 15.6655 18.9266 15.8115C18.5742 15.9576 18.1963 16.0323 17.8148 16.0312H16.875C16.7719 16.0312 16.6875 16.1156 16.6875 16.2188V17.625C16.6875 17.7281 16.7719 17.8125 16.875 17.8125H17.8148C20.4023 17.8125 22.5 15.7148 22.5 13.125C22.5 10.9523 21.0211 9.12422 19.0172 8.59453Z"' +
		' fill="black" />' +
		'</svg>' +
		'</span>' +
		'</button>' +
		'</div>' +
		'  <div class="col-md-1 px-0  adding_plus mx-auto">' +
		'<button id="click_1003_1009" onclick="addExtraAnswer($(this),\'' + questionId + '\')"' +
		' type="button"' +
		' class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
		'<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
		'<span class="p_custom ps-1">' +
		'افزودن' +
		'</span>' +
		'</button>' +
		'</div>' +
		'</div>' +
		'<div class="col-md-12 col-xs-12" id="' + questionTargetMedia + '"></div>' +
		'</div>' +
		'</div>';
	$(thisObj).parent().parent().parent().append(qDiv);


}


function buildQuestionMedia(medias) {




	for (let answerId in medias) {
		let questionMedias = "";
		let answerUniqeId = answerId.split("_")[answerId.split("_").length - 1]
		if (medias.hasOwnProperty(answerId) && medias[answerId] != null) {
			questionMedias += '<div class="row">';
			for (mediaIndex of medias[answerId]) {
				let q_media_id0 = 'q_video_' + answerId + '_' + mediaIndex.id;
				let mediaId0 = mediaIndex.id
				questionMedias +=
					'<div class="col-md-4 px-2">' +
					'<div class="mt-3 answerMedia" id="' + q_media_id0 + '">' +
					'<i class="fa-solid fa-trash-can me-4 ms-2 mt-1  fa-1x float-end hover-shadow"' +
					'style="color: rgb(255, 255, 255);  position: absolute;  z-index: 10000;"' +
					'data-bs-toggle="modal"' +
					'onclick="confirmToRemoveQuestionMedia(\'' + q_media_id0 + '\',' + answerUniqeId + ',' + mediaId0 + ')"></i>' +
					'<div class="row">' +
					'<div class="ratio ratio-16x9">';
				if (mediaIndex.contentType.includes("video")) {
					questionMedias += '<video style="border-radius: 0.9rem; width:95%;border-width: 0px;"' +
						' controls="controls autoplay">' +
						'<source src="' + mediaIndex.mediaUrl + '"' +
						' type="video/mp4" />' +
						'</video>'
				}
				else if (mediaIndex.contentType.includes("image")) {
					questionMedias += '<img src="' + mediaIndex.mediaUrl + '" class="mobileImg_height" style="border-radius: 0.9rem; width:93%;" title="" allowfullscreen="">';
				}


				questionMedias +=
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';

			}
			questionMedias += '</div>';
		}

		$("#questionsMedia_" + answerId).empty();
		$("#questionsMedia_" + answerId).append(questionMedias);

	}

}


function prepareUploadMedia(targetDiv, answerId) {
	if (answerId == 0) {
		$("#generalConfirmBtt").attr("onclick", "$('#generalWarning').modal('toggle');")
		$("#generalConfirmBtt").html("متوجه شدم");
		$("#generalWarningMsg").empty()
		$("#generalWarningMsg").append("<span> برای افزودن ویدیو یا تصویر ابتدا پاسخ را اضافه کنید</span>")
		$("#generalWarning").modal('toggle');
	}
	else {
		$("#anserMediaOverviewBtn").attr("onclick", "addMediaFormTOAnser($(this),'" + targetDiv + "'," + answerId + ",$('#ansMediaForm')[0])")
		$("#anserMediaOverview").modal('toggle');

	}


}

function addMediaFormTOAnser(thisObj, targetDiv, answerId, mediaForms) {

	$(thisObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')
	uploadMedia(mediaForms,
		function successed(data) {
			addMedia2Answer(targetDiv, answerId, JSON.parse(data).id)
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#anserMediaOverview').modal('toggle')

		},
		function error(error) {
			$(thisObj).find('span')[$(thisObj).find('span').length - 1].remove()
			$('#anserMediaOverview').modal('toggle')
		})



}


function addMedia2Answer(targetDiv, answerId, mediaId) {


	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/answer/addMediaToAnswer/" + answerId + "/" + mediaId,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

			let tmpData = {}
			tmpData[targetDiv] = response

			buildQuestionMedia(tmpData)

			// settupBackgroundProfile(null, response.mediaUrl);
		},
		error: function (xhr, status, error) {

			console.log(error)

		}
	});




}


function deleteMediaFromAnswer(answer, mediaId) {
	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/answer/delete/" + answer + "/" + mediaId,
		method: "DELETE",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {

		},
		error: function (xhr, status, error) {

		}
	});
}


function buildWorkSample(skills, selectedWorkSamples) {

	if (skills == null) {
		return
	}

	let selectedWorkSamplesArr = []

	if (selectedWorkSamples != null && selectedWorkSamples != "") {
		selectedWorkSamplesArr = JSON.parse(selectedWorkSamples);
	}

	if (selectedWorkSamples == null) {
		selectedWorkSamples = '[]'
	}

	let selectWS = JSON.parse(selectedWorkSamples)
	let workSampleDiv = "<div class='row'>";

	let i = 1;

	workSamples = [];
	for (skillIndex of skills) {
		if (skillIndex.medias != null && skillIndex.medias.length != 0)
			workSamples = workSamples.concat(skillIndex.medias)
	}
	for (workSample of workSamples) {
		if (i % 4 == 0) {
			workSampleDiv += "</div><div class='row'>"
		}
		workSampleDiv += '<div class="col-md-4">' +
			'<div class="row">' +
			'<div class="col-md-12">';
		if (workSample.contentType.includes("video")) {
			workSampleDiv += '<div class="ratio ratio-16x9"><video style="border-radius: 0.9rem; border-width: 0px;" controls="controls autoplay"><source src="' + workSample.mediaUrl + '" type="video/mp4"></video></div>';
		}
		else if (workSample.contentType.includes("image")) {
			workSampleDiv += '<img src="' + workSample.mediaUrl + '" class="mobileImg_heighsst" style="border-radius: 0.9rem; width:100%;" title="" allowfullscreen="">'
		}
		workSampleDiv +=
			'</div>' +
			'</div>' +
			'<div class="row ">' +
			'<div class="d-flex mobile_margin_right gray_color">' +
			'<input ' + (selectedWorkSamplesArr.includes(Number(workSample.id)) ? 'checked' : '') + ' class="form-check-input selectCheckbox-lr" type="checkbox"' +
			' id="selectedCheckbox_' + workSample.id + '" value="' + workSample.id + '" onchange="changeSelectedValue($(this))" >' +
			'<label' +
			' class="form-check-label p_custom iranYekanLightBold label_margin_lr"' +
			' for="selectedCheckbox_' + workSample.id + '">انتخاب جهت نمایش</label>' +
			'</div>' +
			'</div>' +
			'</div>';
	}

	workSampleDiv += "</div>";
	$("#workSamplesDiv").empty();
	$("#workSamplesDiv").append(workSampleDiv);

}


function changeSelectedValue(thisObj) {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	let url = "";
	if ($(thisObj).prop("checked")) {
		url = "backend/api/groupv2/addSelectedSample/" + $("#groupId").val() + "/" + $(thisObj).val();
	}
	else {
		url = "backend/api/artist/deleteSelectedSample/" + $(thisObj).val();
	}
	$.ajax({
		url: url,
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		// contentType: "application/json", // Set the content type
		success: function (response) {

		},
		error: function (xhr, status, error) {

		}
	});

}


function updateExtraDescription(tagObj) {
	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}
	let data = {
		"groupId": $("#groupId").val(),
		"extra": $("#extraDescription").val()
	}
	$(tagObj).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>')

	$.ajax({
		url: "backend/api/groupv2/updateExtraComment",
		method: "PUT",
		headers: {
			Authorization: "Bearer " + access_token
		},
		data: JSON.stringify(data),
		contentType: "application/json", // Set the content type
		success: function (response) {
			$(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
		},
		error: function (xhr, status, error) {
			$(tagObj).find('span')[$(tagObj).find('span').length - 1].remove()
		}
	});


}

function getProfileInformation() {

	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/artist/getInfo",
		method: "GET",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {


			settupBackgroundProfilePerson((response.background != null ? response.background.mediaUrl : null), (response.profile != null ? response.profile.mediaUrl : null))
			$("#userId").val(response.id)
			$("#userComplateName").val(response.firstname)
			let skillName = ''
			mainSkillVideos = []
			if (response.skills != null) {

				for (skillIndex of response.skills) {
					if (skillIndex.isMainSkill == true) {
						skillName = skillIndex.category.name + " " + (skillIndex.instrument != null ? "(" + skillIndex.instrument.faName + ")" : (skillIndex.artStyle != null ? "(" + skillIndex.artStyle.faName + ")" : ""));

					}

				}

			}
			$("#skillAndCategoryName").empty();
			$("#skillAndCategoryName").append(skillName);



		},
		error: function (xhr, status, error) {



		}
	});
}



function settupBackgroundProfilePerson(backgroundUrl, profileUrl) {
	if (backgroundUrl != null && backgroundUrl != undefined) {
		$('#personalBackground').css('background-image', 'url("' + backgroundUrl + '")');
	}

	if (profileUrl != null && profileUrl != undefined) {
		$('#personalProfileImageId').attr('src', profileUrl);
	}
}