(function() {
    console.log('init');

    var page = document.getElementById( "recording-sound-page" );
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
        } else {
            $(btn_play).addClass(CLASS_NORMAL);
            $(btn_play).removeClass(CLASS_RECORDING);
            tau.changePage($('#page-sound-info')[0]);
        }
    }

    var samplePackage;
    var analyser;
    function startRecord () {
        // draw canvas
        analyser = matcher.createAnalyser("soundCanvas", 0.0, 0.5);
        matcher.startAnalyser(analyser);
        matcher.startSampling();
    }

    function endRecord () {
        samplePackage = matcher.stopSampling();
        // stop draw canvas
        matcher.stopAnalyser(analyser);
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

    function _setValues (title, dial, message) {
        if (title) {
            $('#page-sound-info-titile-input').val(title);
        }
        if (dial) {
            $('#page-sound-info-call-input').val(dial);
        }
        if (message) {
            $('#page-sound-info-message-input').val(message);
        }
    }

    $('#recording-page-save-btn').bind('click', function() {
        var title = $('#page-sound-info-titile-input').val();
        var num = $('#page-sound-info-call-input').val();
        var msg = $('#page-sound-info-message-input').val();
        addNewSound(title, null, samplePackage, num, msg);

        tau.changePage($('#soundlist-page')[0]);
    });

    $('#recording-sound-page').bind("pageshow", function() {
        console.log('pageshow');

        var defaultTitle = "Sound#" + generateNewSoundID();
        var defaultNum = "119";
        var defaultMsg = "청각장애인입니다. 긴급출동 요청합니다.";
        // FIXME:: Modify
        _setValues(defaultTitle, defaultNum, defaultMsg);
    });

    $('#recording-sound-page').bind("pagebeforeshow", function() {
        $(btn_play).removeClass(CLASS_RECORDING);
    });
}());
