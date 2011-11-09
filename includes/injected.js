// ==UserScript==
// @include http://*.craigslist.org/*
// ==/UserScript==
function wrapRow(row){
	var wrapper = document.createElement('div');
	wrapper.setAttribute('style','margin:10px;');
	row.appendChild(wrapper);
	listingURL = row.childNodes[3].getAttribute('href');
	urls = getImgURLs(listingURL, function(urls){
		if(urls.length === 0){
		return;
		}

		for(var url in urls){
			var img = document.createElement('img');
			img.setAttribute('src',urls[url]);
			img.setAttribute('style','max-height:200px;max-width:200px;margin-left:10px;margin-bottom:10px');
			img.setAttribute('class', 'clpreview');
			img.style.display = 'inline';
			wrapper.appendChild(img);
		}
	});
}

function getImgURLs(listingURL, callback){
	var request = new window.XMLHttpRequest();  
	request.open('GET', listingURL, true);  
	request.onreadystatechange = function (aEvt) {  
	  if (request.readyState == 4) {  
	     if (request.status == 200){
		    var imgs = parseResponse(request.responseText);
		    callback(imgs);
	     }
	     else  
	       console.log('Error', request.statusText);  
	  }  
	};  
	request.send(null);
}

function parseResponse(response){
	var div = document.createElement('div');
	div.innerHTML = response;
	var imgTags = div.getElementsByTagName('img');
	var imgs = [];
	for(var i = 0; i<imgTags.length; i++){
		imgs.push(imgTags[i].getAttribute('src'));
	}
	return imgs;
}

function switchVis(bool) {
	var clpreview = document.getElementsByClassName('clpreview');
	for (var i = clpreview.length - 1; i >= 0; i--) {
		clpreview[i].style.display = bool?"inline":"none";
	}
}

window.opera.defineMagicFunction('showImgs', function(showImgs, realThis){
	showImgs();
	if(document.getElementsByClassName('clpreview').length > 0){ // If images are already loaded, just show.
		switchVis(true);
		return false;
	}

	var rows = document.getElementsByClassName('row');
	for(var row = 0; row<rows.length; row++){
		wrapRow(rows[row]);
	}
	return false;
});

window.opera.defineMagicFunction('hideImgs', function(hideImgs, realThis){
	hideImgs();
	switchVis(false);
	return false;
});