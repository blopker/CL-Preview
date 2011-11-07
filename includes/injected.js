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

window.addEventListener( 'DOMContentLoaded', function() {
	if(document.getElementsByClassName('posting').length) return; // Don't run on individual posts.
	if(document.URL.search(/(\/search)?\/\w{3}.*/i)>-1){ // Match CL listing pages.
		var rows = document.getElementsByClassName('row');
		for(var row = 0; row<rows.length; row++){
			wrapRow(rows[row]);
		}
	}
}, false);