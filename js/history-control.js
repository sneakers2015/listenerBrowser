var HistoryControl = (function() {
    console.log('init');

    var page = document.getElementById('page-sound-history');
    var flashPanel = page.querySelector('.flash-panel');

    function startMatcher () {
        // TODO
    }

    function _createNewSoundByStream() {
        var sound;
        return sound;
    }

    function endMatcher() {
        var result;
        if (result) {
            
        }
    }

    function addNewItem () {
        $('.history-container').append("<div class='history-item'><span class='history-item-title'>title</span><span class='history-item-time'>time</span><div class='history-item-icon'>icon</div></div>"
        );
        showFlashPanel('title');
    };

    function _addHistoryItemBySound () {
    };

    function showFlashPanel (text) {
        flashPanel.innerText = text;
        blinkBlue(flashPanel);
    };


    function historyMatchHandler( event, soundID ) {
        console.log( 'history matchHandler', soundID );

        var sound = getSoundByID( soundID );
        if ( !sound.notiEnabled ) {
            return;
        }

        var currentDate = new Date;
        var history = getHistoryByID( soundID );
        if ( !history ) {
            // new history
            addNewHistory(soundID, currentDate);
        } else {
            // exist history
            var diffMs = currentDate - history.timestamp;
            var diffMin =  Math.round(((diffMs % 86400000) % 3600000) / 60000);
            if ( diffMin < 1) {
                // ignore match
                return;
            } else {
                // update time
                history.timestamp = currentDate;
            }
        }

        var noti = {
                id : sound.id,
                title : sound.title,
                dialNumber : sound.number,
                message: sound.message
        }
        notification(noti);

        // FIXME:
        //blink($('#content1')[0]);

        // TODO:: link to send SMS in Alert Dialog

        // FIXME:
        //updateHistoryList();
    }

    page.addEventListener( "pagebeforeshow", function() {
        console.log('pagebeforeshow');

        listenerApp.on('soundMatched', historyMatchHandler);
    });

    page.addEventListener( "pagebeforehide", function() {
        console.log('pagebeforehide');

        listenerApp.off('soundMatched', historyMatchHandler);
    });

//    document.addEventListener('click', function(ev) {
//        console.log('click', ev);
//        addNewItem();
//    });

    return {
    }
}());