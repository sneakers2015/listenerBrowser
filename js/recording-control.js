var RecordingControlUI = (function() {
    console.log('init');

    var page = document.getElementById( "recording-sound-page" );
    var pageSoundInfo = document.getElementById( "page-sound-info" );
    
    var eualizer_bg = page.querySelector('.recording-page-equalizer-bg');
    var btn_play = page.querySelector( "#recording-page-play-btn" );
    var CLASS_RECORDING = 'recording-btn-recording';
    var CLASS_NORMAL = 'recording-btn-normal';

    function getState () {
    	if ($(btn_play).hasClass(CLASS_RECORDING)) {
    		return 'recording';
    	}
    	return 'normal';
    }

    function setState (state) {
    	if (state === 'recording') {
    		$(btn_play).addClass(CLASS_RECORDING);
    		$(btn_play).removeClass(CLASS_NORMAL);
    		$(eualizer_bg).css('display', 'block');
    	} else {
    		$(btn_play).addClass(CLASS_NORMAL);
    		$(btn_play).removeClass(CLASS_RECORDING);
    		$(eualizer_bg).css('display', 'none');
    		tau.changePage(pageSoundInfo);    		
//    		tau.back();
    	}
    }

//
//
//    function updateIcon() {
//    	if (getSate() === 'recording') {
//    		$(btn_play).addClass(CLASS_RECORDING);
//    	} else {
//    		$(btn_play).removeClass(CLASS_RECORDING);
//    	}
//    }
//
    
    var _handleInterval = function () {
    	var r = _.random(0, 255)
    	var g = _.random(0, 255);
    	var b = _.random(0, 255);
    	var a = _.random(0, 100);
    	a = 255;
    	$(eualizer_bg).css('background-color', 'RGBA(' +  r + ',' + g + ',' + b + ',' + a + ')');
    }
    
    
    var samplePackage;
    var analyser;
    var intervalId;
    function startRecord () {
    	_handleInterval();
    	intervalId = setInterval(_handleInterval, 1000);
    	$(eualizer_bg).css('display', 'block');
    	
    	// draw canvas
        analyser = matcher.createAnalyser("soundCanvas", 0.0, 0.5);
    	matcher.startAnalyser(analyser);
    	matcher.startSampling();
    }

    function endRecord () {
    	if (intervalId) {
    		clearInterval(intervalId);
    		intervalId = null;
    		$(eualizer_bg).css('display', 'none');
    	}
    	
        samplePackage = matcher.stopSampling();
        // stop draw canvas
        matcher.stopAnalyser(analyser);
        
    	var newSoundID = generateNewSoundID();
        var defaultTitle = 'Sound Sample #' + newSoundID;
        var randomDial = _.random(0, 100); // FIXME::
        addNewSound(defaultTitle, null, samplePackage, randomDial, 'msg');
    }
    
    btn_play.addEventListener('click', function(ev) {
    	if (getState() === 'recording') {
    		endRecord();
    		setState ('normal');
    	} else {
    		startRecord();
    		setState('recording');
    		
    	}
    });

    page.addEventListener( "pagebeforeshow", function() {
    	$(btn_play).removeClass(CLASS_RECORDING);
    	$(eualizer_bg).css('display', 'none');
    });

    return {
    	
    }
}());
