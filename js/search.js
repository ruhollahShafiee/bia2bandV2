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



function search(){
    let categoryId= $('input[name="cateoryRadio"]:checked').val();
    let name=$("#sugesstedName").val();
    let cityID=$("#ac-menu-1-0").attr("data-value");
    let instrumentId=$("#instrumnets").val();

    let payload={
        "name":name,
        "cityId":cityID,
        "instrumentId":instrumentId,
        "categoryId":categoryId
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
                    '<img alt="cover-3" src="'+ag.backgroundURL+'" class="h-40 object-cover img-fluid">'+
                    '<div class="card-title avatar_margin">'+
                        '<span'+
                            ' class="ant-avatar ant-avatar-circle ant-avatar-image  -mt-14 h-24 w-24 shadow-xl css-dev-only-do-not-override-1a9vt8h">'+
                            '<img class="profileViewImage" src="'+ag.profileUrl+'">'+
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
                                            ag.extraDescription +
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
    getAllInstruments();
    
})




