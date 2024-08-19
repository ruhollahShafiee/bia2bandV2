
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
                                            ' class="btn btn-outline-secondary float-start  text-sm border-dotted px-3 w-75">'+
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
                                            ' class="btn btn-outline-secondary float-start  text-sm border-dotted px-3 w-75">'+
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

$(document).ready(function () {
    getAllSigner();
    allPlayInstrumnet();
    allLyricWriters();
    getAllGroups()
})




