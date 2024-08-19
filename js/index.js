
function getAllSigner(){


    $.ajax({
        url: "backend/api/artist/getAllSigner",
        method: "GET",
        success: function (response) {

            buidArtists(response, "allsigner")   

        },
        error: function (xhr, status, error) {



        }
    });
    
}


function allPlayInstrumnet(){
    
    $.ajax({
        url: "backend/api/artist/getAllMusicPlayer",
        method: "GET",
        success: function (response) {

            buidArtists(response, "allPlayInstumnet")   

        },
        error: function (xhr, status, error) {



        }
    });
}


function allLyricWriters(){
    
    $.ajax({
        url: "backend/api/artist/getAllLyricWriter",
        method: "GET",
        success: function (response) {

            buidArtists(response, "allLyricWriters")   

        },
        error: function (xhr, status, error) {



        }
    });
}


function getAllGroups(){
    
    $.ajax({
        url: "backend/api/groupv2/getAllGroup",
        method: "GET",
        success: function (response) {

            buidlGroups(response, "allGroups")   

        },
        error: function (xhr, status, error) {



        }
    });
}

function buidArtists(aritsts, targetElement) {
    let element = '<div class="carousel-item active"><div class="row">';
    let i = 0;
    for (let artist of aritsts) {

        if(i% 3 == 0 && i !=0 ){
            element += '</div></div><div class="carousel-item"><div class="row">';
        }
        i++
        element +='<div class="col-md-4">'+
                            '<div class="card shadow-sm bg-white border-0">'+
                                '<img alt="cover-3" src="'+(artist.background == null? "assets/icons/banner.png":artist.background.mediaUrl)+'"'+
                                    ' class="h-40 object-cover img-fluid">'+
                                '<div class="card-body avatar_margin">'+
                                    '<div class="card-title d-flex">'+
                                        '<span'+
                                            ' class="ant-avatar ant-avatar-circle ant-avatar-image -mt-14 h-24 w-24 shadow-xl css-dev-only-do-not-override-1a9vt8h">'+
                                            '<img class="profileViewImage" src="'+(artist.profile == null ?"assets/images/avatar.png":artist.profile.mediaUrl)+'">'+
                                        '</span>'+
                                        '<h5 class="w-auto mt-auto ms-1">'+artist.firstname+'</h5>'+
                                    '</div>'+
                                    '<p class="card-text desc_card">'+
                                    (artist.aboutMe == null? "--" : artist.aboutMe.substring(0,100) )+
                                    '</p>'+

                                    '<div class="card-text w-100">'+
                                        '<a href="profile_view.html#artistId='+artist.id+'"'+
                                            ' style="z-index: 1000" class="btn btn-outline-secondary float-start  text-sm border-dotted px-3 w-75">'+
                                            '<span  class="p_custom px-2">'+
                                                'مشاهده اطلاعات'+
                                            '</span>'+
                                        '</a>'+
                                        '<span role="img" aria-label="double-left"'+
                                            ' class="anticon float-end mt-2">'+
                                            '<svg viewBox="64 64 896 896" focusable="false" data-icon="book"'+
                                                ' width="1.5em" height="1.5em" fill="currentColor"'+
                                                ' aria-hidden="true">'+
                                                '<path'+
                                                    ' d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-260 72h96v209.9L621.5 312 572 347.4V136zm220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0022.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z">'+
                                                '</path>'+
                                            '</svg>'+
                                        '</span>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';

    }

    element += '</div></div>';
    $("#"+targetElement).empty();
    $("#"+targetElement).append(element);
    


    
}


function buidlGroups(groups, targetElement) {
    let element = '<div class="carousel-item active"><div class="row">';
    let i = 0;
    for (let group of groups) {

        if(i% 3 == 0 && i !=0 ){
            element += '</div></div><div class="carousel-item"><div class="row">';
        }
        i++
        element +='<div class="col-md-4">'+
                            '<div class="card shadow-sm bg-white border-0">'+
                                '<img alt="cover-3" src="'+(group.background == null? "assets/icons/banner.png":group.background.mediaUrl)+'"'+
                                    ' class="h-40 object-cover img-fluid">'+
                                '<div class="card-body avatar_margin">'+
                                    '<div class="card-title d-flex">'+
                                        '<span'+
                                            ' class="ant-avatar ant-avatar-circle ant-avatar-image -mt-14 h-24 w-24 shadow-xl css-dev-only-do-not-override-1a9vt8h">'+
                                            '<img class="profileViewImage" src="'+(group.profile == null ?"assets/images/avatar.png":group.profile.mediaUrl)+'">'+
                                        '</span>'+
                                        '<h5 class="w-auto mt-auto ms-1">'+group.name+'</h5>'+
                                    '</div>'+
                                    '<p class="card-text desc_card">'+
                                    (group.aboutGroup == null? "--" : group.aboutGroup.substring(0,100) )+
                                    '</p>'+

                                    '<div class="card-text w-100">'+
                                        '<a href="group_view.html#groupId='+group.id+'"'+
                                            ' style="z-index: 1000" class="btn btn-outline-secondary float-start  text-sm border-dotted px-3 w-75">'+
                                            '<span  class="p_custom px-2">'+
                                                'مشاهده اطلاعات'+
                                            '</span>'+
                                        '</a>'+
                                        '<span role="img" aria-label="double-left"'+
                                            ' class="anticon float-end mt-2">'+
                                            '<svg viewBox="64 64 896 896" focusable="false" data-icon="book"'+
                                                ' width="1.5em" height="1.5em" fill="currentColor"'+
                                                ' aria-hidden="true">'+
                                                '<path'+
                                                    ' d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-260 72h96v209.9L621.5 312 572 347.4V136zm220 752H232V136h280v296.9c0 3.3 1 6.6 3 9.3a15.9 15.9 0 0022.3 3.7l83.8-59.9 81.4 59.4c2.7 2 6 3.1 9.4 3.1 8.8 0 16-7.2 16-16V136h64v752z">'+
                                                '</path>'+
                                            '</svg>'+
                                        '</span>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';

    }

    element += '</div></div>';
    $("#"+targetElement).empty();
    $("#"+targetElement).append(element);
    


    
}

function getAllInstruments(){
    

	$.ajax({
		url: "backend/api/instrument/all",
		method: "GET",
		success: function (response) {
            instrumnetsElement='<option value="0" selected>'+
                                    'همه ی دسته بندی ها'+
                                '</option>'
            for(let instrument of response){
                instrumnetsElement +='<option value="'+instrument.id+'">'+
                                    instrument.faName+
                                '</option>'
            }

            $("#instrumnets").empty();
            $("#instrumnets").append(instrumnetsElement);

		},
		error: function (xhr, status, error) {



		}
	});
}


function search(complated){
    let categoryId= $('input[name="cateoryRadio"]:checked').val();
    let name=$("#sugesstedName").val();
    let cityID=$("#ac-menu-1-0").attr("data-value");
    let instrumentId=$("#instrumnets").val();

    let payload={
        "name":name,
        "cityId":cityID,
        "instrumentId":instrumentId,
        "categoryId":categoryId,
        "completed":complated
    }

    $.ajax({
		url: "backend/api/search/searching",
		method: "POST",
		contentType: "application/json", // Set the content type
		data: JSON.stringify(payload),
		success: function (response) {
        
            buildArtistSearch(response,"searchResult")

		},
		error: function (xhr, status, error) {



		}
	});
}


function buildArtistSearch(param,emelentId) {


    let element="";
    

    for(let ag of param){
        element +=
        '<div class=" mt-3 card shadow-sm bg-white border-0">'+
                    '<img alt="cover-3" src="'+(ag.backgroundURL == null || ag.backgroundURL == "" ? "/assets/images/banner.png":ag.backgroundURL)+'" style="object-fit: cover;" class="h-40 mt-2 object-cover img-fluid">'+
                    '<div class="card-title avatar_margin">'+
                        '<span'+
                            ' class="ant-avatar ant-avatar-circle ant-avatar-image  -mt-14 h-24 w-24 shadow-xl css-dev-only-do-not-override-1a9vt8h">'+
                            '<img class="profileViewImage" src="'+(ag.profileUrl == null || ag.profileUrl == "" ? "/assets/images/avatar.png":ag.profileUrl)+'">'+
                        '</span>'+
                    '</div>'+
                    '<div class="card-body">'+
                        '<div class="row">'+
                            '<div class="col-md-8">'+
                                '<h5 class="w-auto mt-1 ms-1">'+
                                ag.name+
                                '</h5>'+
                                '<p class="card-text desc_card">'+
                                (ag.description == null ? "-- " : ag.description.substring(0, 100))+
                                '</p>'+
                                '<p class="card-text">'+
                                    ag.skillCategory+
                                '</p>'+
                            '</div>'+
                            '<div class="col-md-4 ">'+
                                
                                    '<span class="d-inline mx-auto justify-content-center"> '+
                                        '<svg width="64" height="64" viewBox="0 0 64 64" fill="none"'+
                                            ' xmlns="http://www.w3.org/2000/svg">'+
                                            '<g filter="url(#filter0_d_1718_7142)">'+
                                                '<circle cx="32" cy="28" r="23.5" fill="white" stroke="black"></circle>'+
                                                '<path'+
                                                    ' d="M36.8198 18H27.1798C25.0498 18 23.3198 19.74 23.3198 21.86V35.95C23.3198 37.75 24.6098 38.51 26.1898 37.64L31.0698 34.93C31.5898 34.64 32.4298 34.64 32.9398 34.93L37.8198 37.64C39.3998 38.52 40.6898 37.76 40.6898 35.95V21.86C40.6798 19.74 38.9498 18 36.8198 18ZM34.4998 27.4H32.7498V29.21C32.7498 29.62 32.4098 29.96 31.9998 29.96C31.5898 29.96 31.2498 29.62 31.2498 29.21V27.4H29.4998C29.0898 27.4 28.7498 27.06 28.7498 26.65C28.7498 26.24 29.0898 25.9 29.4998 25.9H31.2498V24.21C31.2498 23.8 31.5898 23.46 31.9998 23.46C32.4098 23.46 32.7498 23.8 32.7498 24.21V25.9H34.4998C34.9098 25.9 35.2498 26.24 35.2498 26.65C35.2498 27.06 34.9098 27.4 34.4998 27.4Z"'+
                                                    ' fill="black"></path>'+
                                            '</g>'+
                                            '<defs>'+
                                                '<filter id="filter0_d_1718_7142" x="0" y="0" width="64" height="64"'+
                                                    ' filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">'+
                                                    '<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>'+
                                                    '<feColorMatrix in="SourceAlpha" type="matrix"'+
                                                        ' values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"'+
                                                        ' result="hardAlpha"></feColorMatrix>'+
                                                    '<feOffset dy="4"></feOffset>'+
                                                    '<feGaussianBlur stdDeviation="4"></feGaussianBlur>'+
                                                    '<feComposite in2="hardAlpha" operator="out"></feComposite>'+
                                                    '<feColorMatrix type="matrix"'+
                                                        ' values="0 0 0 0 0.101961 0 0 0 0 0.101961 0 0 0 0 0.101961 0 0 0 0.12 0">'+
                                                    '</feColorMatrix>'+
                                                    '<feBlend mode="normal" in2="BackgroundImageFix"'+
                                                        ' result="effect1_dropShadow_1718_7142"></feBlend>'+
                                                    '<feBlend mode="normal" in="SourceGraphic"'+
                                                        ' in2="effect1_dropShadow_1718_7142" result="shape"></feBlend>'+
                                                '</filter>'+
                                            '</defs>'+
                                        '</svg>'+
                                    '</span>'+
                                    '<span class="d-inline mx-auto justify-content-center" >'+
                                        'ذخیره کردن'+
                                    '</span>'+
                                    '<div class="row ">'+
                                        '<span class="mx-auto d-flex justify-content-center "> '+
                                            (ag.extraDescription == null ? "--": ag.extraDescription) +
                                        '</span>'+
                                    '</div>'+
                                '<div class="row">'+
                                    '<a href="'+(ag.type == 'artist'? "profile_view.html#artistId="+ag.id :"group_view.html#groupId="+ag.id)+'" class="btn btn-outline-secondary text-sm border-dotted px-3 ">'+
                                        '<span class="p_custom px-2">'+
                                            'مشاهده اطلاعات'+
                                        '</span>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
    }

    $("#searchResultCount").empty()
    $("#searchResultCount").append(param.length)

    $("#"+emelentId).empty();
    $("#"+emelentId).append(element)

   

}
$(document).ready(function () {
    getAllInstruments()
    getAllSigner();
    allPlayInstrumnet();
    allLyricWriters();
    getAllGroups()
})




