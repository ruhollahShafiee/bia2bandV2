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

});




function buildMembers(groupId, members) {

	let element = '';

	let i = 0;

	for (let member of members) {
		let profileImageUrl = "/assets/images/avatar.png"
		if (member.profile != null) {
			profileImageUrl = member.profile.mediaUrl;
		}

		let skills = '|';

		for (let skillIndex of member.skills) {
			skills += skillIndex.category.name + '|';
		}
		if(skills == '|'){
			skills="";
		}

		element += '<div class="row">' +
			'<div class="col-4 ">' +
			'<img class="mt-3 mx-auto rounded-circle mybeKnowImage" ' +
			'src="' + profileImageUrl + '">' +
			'</div>' +
			'<div class="col-8 mt-4" style="padding-right: 0px !important;">' +
			'<h9 class="iranYekanLightBold mt-2">' +
			member.firstname +
			'</h9>' +
			'<p class="iranYekanLightBold aboutAdv" style="color: gray;">' +
			skills +
			'</p>' +
			'<p class="iranYekanLightBold aboutAdv float-end">' +
			'<a href="http://localhost/profile_view.html#artistId='+member.id+'">' +
			'بیشتر ...' +
			'</a>'+
			'</p>' +
			'</div>' +
			'</div>'
	}

	$("#teamMembers").empty()
	$("#teamMembers").append(element)
}

function getGroupInformation() {

	

	$.ajax({
		url: "backend/api/groupv2/getInfo/" + $("#groupId").val(),
		method: "GET",
		success: function (response) {


			$("#groupId").val(response.id)
			$("#groupName").empty()
			$("#groupName").append(response.name)
			settupBackgroundProfile((response.background != null ? response.background.mediaUrl : null), (response.profile != null ? response.profile.mediaUrl : null))
			$("#skillAndCategoryName").empty()
			$("#skillAndCategoryName").append(" مدت زمان ایجاد: " + response.createdPeriodTime)
			$("#aboutGroup").empty()
			$("#aboutGroup").append(response.aboutGroup);



			$("#facebookLink").val((response.facebookLink == null ? "" : response.facebookLink))
			$("#twitterLink").val((response.twitterLink == null ? "" : response.twitterLink))
			$("#instagramLinkOne").val((response.instagramLinkOne == null ? "" : response.instagramLinkOne))
			$("#instagramLinkTwo").val((response.instagramLinkTwo == null ? "" : response.instagramLinkTwo))
			$("#aboutGroup").empty("")
			$("#aboutGroup").append((response.aboutGroup == null ? "" : response.aboutGroup))
			$("#aboutGroupPV2").empty("")
			$("#aboutGroupPV2").append((response.aboutGroup == null ? "" : response.aboutGroup.substr(0, 100)))


			// $("#extraDescription").text((response.extraDescription == null ? "" : response.extraDescription));


			buildMembers(response.id, response.members)
			buidGroupMedia(response.medias, response.skills)
			buildSkill(response.skills)
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

function settupBackgroundProfile(backgroundUrl, profileUrl) {
	if (backgroundUrl != null && backgroundUrl != undefined) {
		$('#groupBackground').css('background-image', 'url("' + backgroundUrl + '")');
	}

	if (profileUrl != null && profileUrl != undefined) {
		$('#groupProfileImageId').attr('src', profileUrl);
	}
}




function buidGroupMedia(medias, skills) {

	let element = '<div class="row">';
	let i = 1;
	for (let media of medias) {
		if (i % 3 == 0) {
			element += '</div><div class="row">'
		}
		i++;
		if (media.contentType != null && (media.contentType.includes("video"))) {
			element +=
				'<div class="col-md-4 col-xs-12">' +
				'<div class="ratio ratio-16x9 mt-2" >' +
				'<video style="border-radius: 0.9rem; border-width: 0px;"' +
				'controls="controls autoplay">' +
				'<source src="' + media.mediaUrl + '" type="video/mp4">' +
				'</video>' +
				'</div>' +
				'</div>';


		}
		else {
			element +=
				'<div class="col-md-4 col-xs-12">' +
				'<div class="ratio ratio-16x9 mt-2">' +
				'<img src="' + media.mediaUrl + '" class="w-100 mx-auto"' +
				'style="border-radius: 0.9rem; " title="">' +
				'</div>' +
				'</div>'

		}
	}

	i--;

	for (let skill of skills) {
		for (let media of skill.medias) {
			if (i % 3 == 0) {
				element += '</div><div class="row">'
			}
			i++;
			if (media.contentType != null && (media.contentType.includes("video"))) {
				element +=
					'<div class="col-md-4 col-xs-12">' +
					'<div class="ratio ratio-16x9 mt-2" >' +
					'<video style="border-radius: 0.9rem; border-width: 0px;"' +
					'controls="controls autoplay">' +
					'<source src="' + media.mediaUrl + '" type="video/mp4">' +
					'</video>' +
					'</div>' +
					'</div>';


			}
			else {
				element +=
					'<div class="col-md-4 col-xs-12">' +
					'<div class="ratio ratio-16x9 mt-2">' +
					'<img src="' + media.mediaUrl + '" class="w-100 mx-auto"' +
					'style="border-radius: 0.9rem; " title="">' +
					'</div>' +
					'</div>'

			}
		}
	}

	element += '</div>'


	$("#worksamples").empty();
	$("#worksamples").append(element);




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









function settupBackgroundProfilePerson(backgroundUrl, profileUrl) {
	if (backgroundUrl != null && backgroundUrl != undefined) {
		$('#personalBackground').css('background-image', 'url("' + backgroundUrl + '")');
	}

	if (profileUrl != null && profileUrl != undefined) {
		$('#personalProfileImageId').attr('src', profileUrl);
	}
}



function buildSkill(skills) {

	// skills = [{ "id": 1, "category": { "id": 1003, "name": "ترانه سرا" }, "instrument": null, "workExperienceYears": 20, "medias": [{ "id": "1", "uniqueId": "176591c5-c0a0-4748-86b9-698561aa016b", "title": "sacascsac", "description": "cwcwc", "uploadedAt": "2024-06-10T09:56:41.947+00:00", "mediaUrl": "/media/176591c5-c0a0-4748-86b9-698561aa016b", "contentType": "video/mp4" }, { "id": "1121", "uniqueId": "1c985a1f-e5d2-48d0-8f23-9857b428eb2e", "title": null, "description": null, "uploadedAt": "2024-06-28T15:35:43.315+00:00", "mediaUrl": "/media/1c985a1f-e5d2-48d0-8f23-9857b428eb2e", "contentType": "video/mp4" }, { "id": "1119", "uniqueId": "1087520c-297e-4995-92da-cde19bbe04f4", "title": null, "description": null, "uploadedAt": "2024-06-28T14:17:05.294+00:00", "mediaUrl": "/media/1087520c-297e-4995-92da-cde19bbe04f4", "contentType": "image/jpeg" }, { "id": "1120", "uniqueId": "49da298f-4a4b-4816-bad4-08e2f4fd7ff6", "title": null, "description": null, "uploadedAt": "2024-06-28T15:35:23.804+00:00", "mediaUrl": "/media/49da298f-4a4b-4816-bad4-08e2f4fd7ff6", "contentType": "image/jpeg" }], "artist": null, "group": null, "informationQuestions": [{ "id": 1041, "question": "آیا سابقه حضور در کارگاه های آموزشی و مستر کالس ها را دارید؟", "reversQuestion": "سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارم", "informationAnswers": [{ "id": 1029, "answer": "بیست سال", "medias": [], "informationQuestionId": 1041, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1006, "question": "آیا سابقه ی تدریس در آموزشگاه ها را داشته اید؟", "reversQuestion": "سابقه ی تدریس در آموزشگاه ها را داشته ام", "informationAnswers": [{ "id": 1021, "answer": "چهل ماه", "medias": [{ "id": "1154", "uniqueId": "de45e71b-579d-4560-9cb8-62f8845da5fc", "title": null, "description": null, "uploadedAt": "2024-07-07T15:47:44.258+00:00", "mediaUrl": "/media/de45e71b-579d-4560-9cb8-62f8845da5fc", "contentType": "image/jpeg" }], "informationQuestionId": 1006, "have": true }, { "id": 1024, "answer": "24", "medias": [{ "id": "1155", "uniqueId": "72ad0338-e807-4261-a91a-9fa7892eaa44", "title": null, "description": null, "uploadedAt": "2024-07-07T15:48:13.503+00:00", "mediaUrl": "/media/72ad0338-e807-4261-a91a-9fa7892eaa44", "contentType": "image/webp" }], "informationQuestionId": 1006, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1003, "question": "آیا سابقه ی حضور در جشنواره ی موسیقی داشته اید؟", "reversQuestion": "سابقه ی حضور در جشنواره ی موسیقی داشته ام", "informationAnswers": [{ "id": 1014, "answer": "فجر", "medias": [], "informationQuestionId": 1003, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 3, "question": "آیا سابقه ی ضبط استودیویی دارید؟", "reversQuestion": "سابقه ی ضبط استودیویی دارم", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1005, "question": "آیا سابقه ی همکاری با رسانه ی ملی داشته اید؟", "reversQuestion": "سابقه ی همکاری با رسانه ی ملی داشته ام", "informationAnswers": [{ "id": 1022, "answer": "12", "medias": [], "informationQuestionId": 1005, "have": true }, { "id": 1017, "answer": "89", "medias": [], "informationQuestionId": 1005, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1051, "question": "آیا سابقه ترانه سرایی روی آهنگ را دارید؟", "reversQuestion": "سابقه ترانه سرایی روی آهنگ را داریم", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1042, "question": "آیا مدارک اکادمیک در زمینه تخصصی خود دارید؟", "reversQuestion": "مدارک اکادمیک در زمینه تخصصی خود دارم", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1044, "question": "آیا سابقه ی ضبط استودیویی دارید؟", "reversQuestion": "سابقه ی ضبط استودیویی دارم", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1002, "question": "آیا سابقه ی حضور در آلبوم موسیقی داشته اید؟", "reversQuestion": "سابقه ی حضور در آلبوم موسیقی داشته ام", "informationAnswers": [{ "id": 1023, "answer": "چکاوک ", "medias": [{ "id": "1153", "uniqueId": "940e9e03-a568-4f8a-9059-a3f8f9762716", "title": null, "description": null, "uploadedAt": "2024-07-05T14:22:34.529+00:00", "mediaUrl": "/media/940e9e03-a568-4f8a-9059-a3f8f9762716", "contentType": "image/jpeg" }], "informationQuestionId": 1002, "have": true }, { "id": 1013, "answer": "موسیقی کلاسیک", "medias": [{ "id": "1151", "uniqueId": "bc1b509b-b1c6-4e15-b66f-aa40b2fb7db0", "title": null, "description": null, "uploadedAt": "2024-07-05T14:21:50.743+00:00", "mediaUrl": "/media/bc1b509b-b1c6-4e15-b66f-aa40b2fb7db0", "contentType": "image/jpeg" }, { "id": "1152", "uniqueId": "349dff96-7161-4d5a-9aa1-16f1f11b6f13", "title": null, "description": null, "uploadedAt": "2024-07-05T14:22:03.850+00:00", "mediaUrl": "/media/349dff96-7161-4d5a-9aa1-16f1f11b6f13", "contentType": "image/jpeg" }], "informationQuestionId": 1002, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1050, "question": "با چه اهنگسازانی تا کنون کار کرده اید؟", "reversQuestion": "با  اهنگسازانی تا کنون کار کرده ام؟", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1046, "question": "آیا سابقه ی حضور در جشنواره ی شعرداشته اید؟", "reversQuestion": "سابقه ی حضور در جشنواره ی شعرداشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 2, "question": "آیا سابقه ی اجرای صحنه ایی داشته اید؟", "reversQuestion": "سابقه ی اجرای صحنه ایی داشته ام", "informationAnswers": [{ "id": 1015, "answer": "1", "medias": [], "informationQuestionId": 2, "have": true }, { "id": 1016, "answer": "2", "medias": [], "informationQuestionId": 2, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1043, "question": "آیا سابقه ی اجرای صحنه ایی(خوانش شعر)داشته اید؟", "reversQuestion": "سابقه ی اجرای صحنه ایی(خوانش شعر)داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1049, "question": "با چه خواننده هایی تا کنون کار کرده اید؟", "reversQuestion": "با خواننده هایی تا کنون کار کرده ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1052, "question": "آیا سابقه برگزاری کنسرت هنرجویی یا کارگاه برای هنرجویان را داشته اید؟", "reversQuestion": "سابقه برگزاری کنسرت هنرجویی یا کارگاه برای هنرجویان را داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1004, "question": "آیا سابقه ی همکاری با گروه های موسیقی داشته اید؟", "reversQuestion": "سابقه ی همکاری با گروه های موسیقی داشته ام", "informationAnswers": [{ "id": 1018, "answer": "89", "medias": [], "informationQuestionId": 1004, "have": true }, { "id": 1020, "answer": "91", "medias": [], "informationQuestionId": 1004, "have": true }, { "id": 1019, "answer": "90", "medias": [], "informationQuestionId": 1004, "have": true }], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1, "question": "آیا سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارید؟", "reversQuestion": "سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارم", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1045, "question": "آیا سابقه ی حضور در آلبوم موسیقی داشته اید؟", "reversQuestion": "سابقه ی حضور در آلبوم موسیقی داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }, { "id": 1047, "question": "آیا سابقه ی همکاری با گروه های موسیقی داشته اید؟", "reversQuestion": "سابقه ی همکاری با گروه های موسیقی داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 1 }], "artStyle": { "id": 13, "faName": "سنتی", "enName": "traditional", "category": { "id": 1003, "name": "ترانه سرا" } } }, { "id": 2, "category": { "id": 2, "name": "خواننده" }, "instrument": null, "workExperienceYears": 20, "medias": [], "artist": null, "group": null, "informationQuestions": [{ "id": 1054, "question": "آیا سابقه ی اجرای صحنه ایی داشته اید؟", "reversQuestion": "سابقه ی اجرای صحنه ایی داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1053, "question": "آیا سابقه حضور در کارگاه های آموزشی و مستر کالس ها را دارید؟", "reversQuestion": "سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارم", "informationAnswers": [{ "id": 1030, "answer": null, "medias": [], "informationQuestionId": 1053, "have": true }], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1058, "question": "آیا سابقه ی همکاری با رسانه ی ملی داشته اید؟", "reversQuestion": "سابقه ی همکاری با رسانه ی ملی داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1055, "question": "آیا سابقه ی ضبط استودیویی دارید؟", "reversQuestion": "سابقه ی ضبط استودیویی دارم", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1056, "question": "آیا سابقه ی حضور در جشنواره ی موسیقی داشته اید؟", "reversQuestion": "سابقه ی حضور در جشنواره ی موسیقی داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1060, "question": "آیا سابقه برگزاری کنسرت هنرجویی یا کارگاه برای هنرجویان را داشته اید؟", "reversQuestion": "سابقه برگزاری کنسرت هنرجویی یا کارگاه برای هنرجویان را داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1059, "question": "آیا سابقه ی تدریس در آموزشگاه ها را داشته اید؟", "reversQuestion": "سابقه ی تدریس در آموزشگاه ها را داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }, { "id": 1057, "question": "آیا سابقه ی همکاری با گروه های موسیقی داشته اید؟", "reversQuestion": "سابقه ی همکاری با گروه های موسیقی داشته ام", "informationAnswers": [], "groupId": null, "artistId": 1, "skillId": 2 }], "artStyle": { "id": 1, "faName": "پاپ", "enName": "Pop", "category": { "id": 2, "name": "خواننده" } } }]

	let skillTab = "";
	selecteTab = true;
	$("#myTabContentQustionOfSkill").empty();

	for (skill of skills) {
		skilltabId = 'skill' + skill.id + '';
		skillTab += '<li class="nav-item" role="presentation">' +
			'<button class="nav-link ' + (selecteTab ? 'active' : '') + '" id="skillTab_' + skill.id + '" data-bs-toggle="tab"' +
			' data-bs-target="#' + skilltabId + '" type="button" role="tab" aria-controls="' + skilltabId + '"' +
			' aria-selected="true">' +
			' <h5 class="iranYekanLightBold text-start tabStart"> ساز ' + (skill.instrument != null ? skill.instrument.faName : '') + '</h5>' +
			' </button>' +
			'</li>';

		buildQuestion(skill.informationQuestions, skilltabId, selecteTab)
		selecteTab = false;
	}

	$("#skillTab").empty();
	$("#skillTab").append(skillTab);

}

function buildQuestion(questionList, skillTabId, isActive) {

	// questionList=[{"id":1041,"question":"آیا سابقه حضور در کارگاه های آموزشی و مستر کالس ها را دارید؟","reversQuestion":"سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارم","informationAnswers":[{"id":1029,"answer":"بیست سال","medias":[],"informationQuestionId":1041,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":1006,"question":"آیا سابقه ی تدریس در آموزشگاه ها را داشته اید؟","reversQuestion":"سابقه ی تدریس در آموزشگاه ها را داشته ام","informationAnswers":[{"id":1021,"answer":"چهل ماه","medias":[{"id":"1154","uniqueId":"de45e71b-579d-4560-9cb8-62f8845da5fc","title":null,"description":null,"uploadedAt":"2024-07-07T15:47:44.258+00:00","mediaUrl":"/media/de45e71b-579d-4560-9cb8-62f8845da5fc","contentType":"image/jpeg"}],"informationQuestionId":1006,"have":true},{"id":1024,"answer":"24","medias":[{"id":"1155","uniqueId":"72ad0338-e807-4261-a91a-9fa7892eaa44","title":null,"description":null,"uploadedAt":"2024-07-07T15:48:13.503+00:00","mediaUrl":"/media/72ad0338-e807-4261-a91a-9fa7892eaa44","contentType":"image/webp"}],"informationQuestionId":1006,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":1003,"question":"آیا سابقه ی حضور در جشنواره ی موسیقی داشته اید؟","reversQuestion":"سابقه ی حضور در جشنواره ی موسیقی داشته ام","informationAnswers":[{"id":1014,"answer":"فجر","medias":[],"informationQuestionId":1003,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":3,"question":"آیا سابقه ی ضبط استودیویی دارید؟","reversQuestion":"سابقه ی ضبط استودیویی دارم","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1005,"question":"آیا سابقه ی همکاری با رسانه ی ملی داشته اید؟","reversQuestion":"سابقه ی همکاری با رسانه ی ملی داشته ام","informationAnswers":[{"id":1022,"answer":"12","medias":[],"informationQuestionId":1005,"have":true},{"id":1017,"answer":"89","medias":[],"informationQuestionId":1005,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":1051,"question":"آیا سابقه ترانه سرایی روی آهنگ را دارید؟","reversQuestion":"سابقه ترانه سرایی روی آهنگ را داریم","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1042,"question":"آیا مدارک اکادمیک در زمینه تخصصی خود دارید؟","reversQuestion":"مدارک اکادمیک در زمینه تخصصی خود دارم","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1044,"question":"آیا سابقه ی ضبط استودیویی دارید؟","reversQuestion":"سابقه ی ضبط استودیویی دارم","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1002,"question":"آیا سابقه ی حضور در آلبوم موسیقی داشته اید؟","reversQuestion":"سابقه ی حضور در آلبوم موسیقی داشته ام","informationAnswers":[{"id":1023,"answer":"چکاوک ","medias":[{"id":"1153","uniqueId":"940e9e03-a568-4f8a-9059-a3f8f9762716","title":null,"description":null,"uploadedAt":"2024-07-05T14:22:34.529+00:00","mediaUrl":"/media/940e9e03-a568-4f8a-9059-a3f8f9762716","contentType":"image/jpeg"}],"informationQuestionId":1002,"have":true},{"id":1013,"answer":"موسیقی کلاسیک","medias":[{"id":"1151","uniqueId":"bc1b509b-b1c6-4e15-b66f-aa40b2fb7db0","title":null,"description":null,"uploadedAt":"2024-07-05T14:21:50.743+00:00","mediaUrl":"/media/bc1b509b-b1c6-4e15-b66f-aa40b2fb7db0","contentType":"image/jpeg"},{"id":"1152","uniqueId":"349dff96-7161-4d5a-9aa1-16f1f11b6f13","title":null,"description":null,"uploadedAt":"2024-07-05T14:22:03.850+00:00","mediaUrl":"/media/349dff96-7161-4d5a-9aa1-16f1f11b6f13","contentType":"image/jpeg"}],"informationQuestionId":1002,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":1050,"question":"با چه اهنگسازانی تا کنون کار کرده اید؟","reversQuestion":"با  اهنگسازانی تا کنون کار کرده ام؟","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1046,"question":"آیا سابقه ی حضور در جشنواره ی شعرداشته اید؟","reversQuestion":"سابقه ی حضور در جشنواره ی شعرداشته ام","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":2,"question":"آیا سابقه ی اجرای صحنه ایی داشته اید؟","reversQuestion":"سابقه ی اجرای صحنه ایی داشته ام","informationAnswers":[{"id":1015,"answer":"1","medias":[],"informationQuestionId":2,"have":true},{"id":1016,"answer":"2","medias":[],"informationQuestionId":2,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":1043,"question":"آیا سابقه ی اجرای صحنه ایی(خوانش شعر)داشته اید؟","reversQuestion":"سابقه ی اجرای صحنه ایی(خوانش شعر)داشته ام","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1049,"question":"با چه خواننده هایی تا کنون کار کرده اید؟","reversQuestion":"با خواننده هایی تا کنون کار کرده ام","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1052,"question":"آیا سابقه برگزاری کنسرت هنرجویی یا کارگاه برای هنرجویان را داشته اید؟","reversQuestion":"سابقه برگزاری کنسرت هنرجویی یا کارگاه برای هنرجویان را داشته ام","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1004,"question":"آیا سابقه ی همکاری با گروه های موسیقی داشته اید؟","reversQuestion":"سابقه ی همکاری با گروه های موسیقی داشته ام","informationAnswers":[{"id":1018,"answer":"89","medias":[],"informationQuestionId":1004,"have":true},{"id":1020,"answer":"91","medias":[],"informationQuestionId":1004,"have":true},{"id":1019,"answer":"90","medias":[],"informationQuestionId":1004,"have":true}],"groupId":null,"artistId":1,"skillId":1},{"id":1,"question":"آیا سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارید؟","reversQuestion":"سابقه حضور در کارگاه های آموزشی و مستر کلاس ها را دارم","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1045,"question":"آیا سابقه ی حضور در آلبوم موسیقی داشته اید؟","reversQuestion":"سابقه ی حضور در آلبوم موسیقی داشته ام","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1},{"id":1047,"question":"آیا سابقه ی همکاری با گروه های موسیقی داشته اید؟","reversQuestion":"سابقه ی همکاری با گروه های موسیقی داشته ام","informationAnswers":[],"groupId":null,"artistId":1,"skillId":1}]
	let questionDiv = '';
	questionDiv += '<div class="tab-pane fade ' + (isActive ? 'show active' : '') + '" id="' + skillTabId + '" role="tabpanel"' +
		'aria-labelledby="home-tab">'

	for (questionIndex of questionList) {
		questionDiv += '<div class="row">'
		questionDiv += '<div class="row">' +
			'<h6 class="iranYekanLightBold mt-4 ps-2 tabStart">' +
			questionIndex.reversQuestion +
			'</h6>' +
			'</div>';
		if (questionIndex.informationAnswers != null && questionIndex.informationAnswers.length != 0) {
			questionDiv += '<div class="row">';
			for (ansIndex of questionIndex.informationAnswers) {
				if (ansIndex == null)
					continue

				questionDiv += '<div class="col-md-4">' +
					'<ul class="ul_list iranYekanLight tabStart" style="margin-bottom: 0px;">' +
					'<li>' + (ansIndex.answer == null || ansIndex.answer == 'null' ? '--' : ansIndex.answer) + ' </li>' +
					'</ul>' +
					'</div >' +
					'<div class="col-md-8">' +
					'<div class="row">';
				if (ansIndex.medias != null) {
					for (mediaIndex of ansIndex.medias) {
						if (mediaIndex.contentType.includes("video")) {
							questionDiv +=
								'<div class="col-md-4">' +
								'<div class="ratio ratio-16x9 mt-3">' +
								'<video' +
								' style="border-radius: 0.9rem; border-width: 0px;height:7.2rem;"' +
								' controls="controls autoplay w-100 h-100">' +
								'<source src="' + mediaIndex.mediaUrl + '"' +
								' type="' + mediaIndex.contentType + '">' +
								'</video>' +
								'</div>' +
								'</div>';
						}
						else if (mediaIndex.contentType.includes("image")) {
							questionDiv +=
								'<div class="col-md-4 mt-3">' +
								'<img src="' + mediaIndex.mediaUrl + '"' +
								'style="border-radius: 0.9rem;height:7.2rem; width:100%;" title=""' +
								'allowfullscreen="">' +
								'</div>';
						}
					}
				}
				questionDiv += '</div>'
				questionDiv += '</div>'

			}
			questionDiv += '</div>'

		}
		else {
			questionDiv +=
				'<div class="row">' +
				'<div class="col-md-4">' +
				'<ul class="ul_list iranYekanLight tabStart" style="  margin-bottom: 0px;">' +
				'<li>-- </li>' +
				'</ul>' +
				'</div>' +
				'</div>'
		}



		questionDiv += '</div>'

	}

	questionDiv += '</div>';


	$("#myTabContentQustionOfSkill").append(questionDiv);

}
