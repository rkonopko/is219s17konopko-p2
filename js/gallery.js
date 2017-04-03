// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() 
{
    if (mCurrentIndex > mImages.length - 1) 
    {
        mCurrentIndex = 0;
    } 
    else if (mCurrentIndex < 0) 
    {
        mCurrentIndex = mImages.length - 1;

    }
    
    //description
    $('#slideShow .photoHolder img').attr('src', mImages[mCurrentIndex].imgPath);
    $('#slideShow .details .location').text("Location: " + mImages[mCurrentIndex].location);
    $('#slideShow .details .description ').text("Description: " + mImages[mCurrentIndex].description);
    $('#slideShow .details .date ').text("Date: " + mImages[mCurrentIndex].date);
    console.log('swap photo');
    mCurrentIndex++;
}      

function getQueryParm(pa) 
{
    pa = pa.split("+").join(" ");
    var parm = {},
        tokens,
        sig = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = sig.exec(pa)) 
    {
        parm[decodeURIComponent(tokens[1])]
             = decodeURIComponent(tokens[2]);
    }
    return parm;
}
var $_GET = getQueryParm(document.location.search);

// Counter for the mImages array
var mCurrentIndex = 1;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = "images.json";


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() 

{
    $('.details').eq(0).hide();       
    $("img.moreIndicator").click(function ()
    {
        if ($(this).hasClass("rot90")) 
        {
            $(this).removeClass("rot90").addClass("rot270");
            $("div.details").fadeToggle("fast", "linear");
        } 
        else 
            {
                $(this).removeClass("rot270").addClass("rot90");
                $("div.details").fadeToggle("fast", "linear");
            }
        
    });

    $("#nextPhoto").css({"position": "absolute", "right": "0"});
    $("#nextPhoto").click(function () 
    {
        swapPhoto()
    });
    $("#prevPhoto").click(function () 
    {
        mCurrentIndex = mCurrentIndex - 2;
        swapPhoto()
    });
        
    
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(imgPath, location, description, date) 
{
    this.imgPath = imgPath;
    this.location = location;
    this.description = description;
    this.date = date;

}

function reListener() 
{
    console.log(JSON.parse(this.responseText));
    var mJson = JSON.parse(this.responseText);
    for (var i = 0; i < mJson.images.length; i++) 
    {
        var now = mJson.images[i];
        var imageDesc = new GalleryImage(now.imgPath, now.location, now.description, now.date);
        
        mImages.push(imageDesc);

    }
}
mRequest.addEventListener("load", reListener);
mRequest.open("GET", mUrl);
mRequest.send();