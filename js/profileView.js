function getCategories(id, sucCallback, errCallback) {
	let access_token = getCookie("access_token");
	if (access_token == undefined || access_token == "" || access_token == null) {
		location.href = 'login.html';
	}

	$.ajax({
		url: "backend/api/category/find/" + id,
		method: "GET",
		headers: {
			Authorization: "Bearer " + access_token
		},
		success: function (response) {
			sucCallback(response)
		},
		error: function (xhr, status, error) {
			errCallback(error)
		}
	});
}


function buildSkill(skills) {



	let skillTab = "";
	selecteTab = true;
	$("#myTabContentQustionOfSkill").empty();

	for (skill of skills) {
		skilltabId = 'skill' + skill.id + '';
		skillTab += '<li class="nav-item" role="presentation">' +
			'<button class="nav-link ' + (selecteTab ? 'active' : '') + '" id="skillTab_' + skill.id + '" data-bs-toggle="tab"' +
			' data-bs-target="#' + skilltabId + '" type="button" role="tab" aria-controls="' + skilltabId + '"' +
			' aria-selected="true">' +
			' <h5 class="iranYekanLightBold text-start tabStart">' + skill.category.name + (skill.artStyle != null ? ' (' + skill.artStyle.faName + ') ' : (skill.instrument != null ? ' (' + skill.instrument.faName + ') ' : '')) + '</h5>' +
			' </button>' +
			'</li>';

		buildQuestion(skill.informationQuestions, skilltabId, selecteTab)
		selecteTab = false;
	}

	$("#skillTab").empty();
	$("#skillTab").append(skillTab);

}

function buildQuestion(questionList, skillTabId, isActive) {


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

function settupBackgroundProfile(backgroundUrl, profileUrl) {
	if (backgroundUrl != null && backgroundUrl != undefined) {
		$('#personalBackground').css('background-image', 'url("' + backgroundUrl + '")');
	}

	if (profileUrl != null && profileUrl != undefined) {
		$('#personalProfileImageId').attr('src', profileUrl);
	}
}


function getProfileInformation() {



	$.ajax({
		url: "backend/api/artist/getInfo/" + $("#artistId").val(),
		method: "GET",
		success: function (response) {

			buildSkill(response.skills)
			let haveSkill = (response.skills == null || response.skills.length == 0 ? false : true)

			settupBackgroundProfile((response.background != null ? response.background.mediaUrl : null), (response.profile != null ? response.profile.mediaUrl : null))

			$("#fullNamePV").empty();
			$("#fullNamePV").append(response.firstname)

			let skillName = ''
			mainSkillVideos = []
			if (response.skills != null) {

				for (skillIndex of response.skills) {
					if (skillIndex.isMainSkill == true) {
						skillName = skillIndex.category.name + " " + (skillIndex.instrument != null ? "(" + skillIndex.instrument.faName + ")" : (skillIndex.artStyle != null ? "(" + skillIndex.artStyle.faName + ")" : ""));
						mainSkillVideos = mainSkillVideos.concat(skillIndex.medias)
					}

				}

			}
			$("#skillAndCategoryName").empty();
			$("#skillAndCategoryName").append(skillName);

			$("#aboutMePV").empty();
			$("#aboutMePV").append(response.extraDescription);

			$("#aboutMePV2").empty();
			$("#aboutMePV2").append(response.aboutMe);

			buildWorkSample(mainSkillVideos, response.selectMediaIdsWorksamples)

			// buildQuestions(response.informationQuestions)
			// $("#skillId").val((haveSkill ? response.skills[0].id : 0))
			// buidSkillMedia((haveSkill ? response.skills[0].medias : []), (haveSkill ? response.skills[0].id : 0))





		},
		error: function (xhr, status, error) {



		}
	});
}


function buildWorkSample(mainSkillVideos, selectedWorkSamples) {

	let selectedWorkSamplesArr = []

	if (selectedWorkSamples != null && selectedWorkSamples != "") {
		selectedWorkSamplesArr = JSON.parse(selectedWorkSamples);
	}
	workSampleDiv = "";

	flag = false;

	for (mediaindex of mainSkillVideos) {


		if (selectedWorkSamplesArr.includes(Number(mediaindex.id)) && mediaindex.contentType.includes("video")) {

			flag = true;

			workSampleDiv = '<video style="border-radius: 0.9rem; border-width: 0px;" controls="controls autoplay">' +
				'<source src="' + mediaindex.mediaUrl + '" type="video/mp4">' +
				'</video>';
			break;

		}
	}

	if (!flag) {
		workSampleDiv = '<img src="/assets/images/videoNotFound.png" class="mobileImg_heighsst" style="border-radius: 0.9rem; width:100%;" title="">'
	}

	$("#sampleVideoPV").empty();
	$("#sampleVideoPV").append(workSampleDiv);

}


function showAllWorkSample() {
	// $("#anserMediaOverviewBtn").attr("onclick", "addMediaFormTOAnser($(this),'" + targetDiv + "'," + answerId + ",$('#ansMediaForm')[0])")


	$.ajax({
		url: "backend/api/skill/allSelectedMedias/" + $("#artistId").val(),
		method: "GET",
		success: function (response) {

			let divElm = "";
			for (mediaIndex of response) {
				if (mediaIndex.contentType.includes("video")) {
					divElm +=
						'<div class="col-md-3 mt-3 px-2">' +
						'<div class="ratio ratio-16x9">' +
						'<video style="border-radius: 0.9rem; border-width: 0px;"' +
						' controls="controls autoplay">' +
						'<source src="' + mediaIndex.mediaUrl + '" type="' + mediaIndex.contentType + '">' +
						'</video>' +
						'</div>' +
						'</div>';
				}
				else if (mediaIndex.contentType.includes("image")) {
					divElm +=
						'<div class="col-md-3 mt-3 answerMedia">' +
						'<div class="ratio ratio-16x9">' +
						'<img src="' + mediaIndex.mediaUrl + '" class="mobileImg_height"' +
						' style="border-radius: 0.9rem;" title="" allowfullscreen="">' +
						'	</div>' +
						'</div>'
				}
			}

			$("#allWorkSampleVideos").empty();
			$("#allWorkSampleVideos").append(divElm);
			$("#workSampleOverView").modal('toggle');


		},
		error: function (xhr, status, error) {
			alert("خطایی رخ داده است ")


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


	if (window.location.href.split("#").length == 2) {
		if (window.location.href.split("#")[1].split("artistId=").length == 2) {
			$("#artistId").val(window.location.href.split("#")[1].split("artistId=")[1])
			getProfileInformation()
		}
		else {
			$("#artistId").val("0")
			getProfileInformation()
		}
	}


});


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
				'<button id="click_' + question_answer_id + '" onclick="saveOrUpdateAnswer(' + question.id + ',\'' + question_answer_id + '\')" type="button" class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
				// '<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
				'<span class="p_custom ps-1 mx-auto">' +
				'ثبت' +
				'</span>' +
				'</button>' +
				'</div>' +
				'<div class="col-md-4 pt-2">' +
				'<button id="prepareUploadMedia_' + question_answer_id + '" type="button" onclick="prepareUploadMedia(\'' + question_answer_id + '\',0)" class="btn btn-outline-secondary w-100 border-dotted5 d-flex">' +
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
				'<button id="click_' + question_answer_id + '" onclick="saveOrUpdateAnswer(' + question.id + ',\'' + question_answer_id + '\')" type="button" class="btn btn-outline-secondary w-100 border-width d-flex padding_right_mobile">' +
				// '<i class="fa-solid fa-plus padding_right_4rem_mobile"></i>' +
				'<span class="p_custom ps-1 mx-auto">' +
				'ثبت' +
				'</span>' +
				'</button>' +
				'</div>' +
				'<div class="col-md-4 pt-2">' +
				'<button id="prepareUploadMedia_' + question_answer_id + '" type="button" onclick="prepareUploadMedia(\'' + question_answer_id + '\',' + answerIndex.id + ')" class="btn btn-outline-secondary w-100 border-dotted5 d-flex">' +
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
