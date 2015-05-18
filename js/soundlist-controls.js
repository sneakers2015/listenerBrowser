var SoundListControl = (function() {
    console.log('init');

    var listElement = $('#sound-listview')[0];
    var swipeList = null; //dynamic create

    function updateSoundList () {
        console.log('updateSoundList');

        var soundListView = $('#sound-listview');
        soundListView.children().remove();
        for (var i in listenerApp.sounds) {
            var sound = listenerApp.sounds[i];
            addSoundListItem(sound.id, sound.title, sound.enabled, sound.dialNumber);
        }
        refreshSwipeList();
    }

    function addSoundListItem (id, title, enabled, dialNumber) {
        console.log('addSoundListItem');

        var li, label, span, input;
        li = document.createElement('li')
        label = document.createElement('label');
        span = document.createElement('span');
        input = document.createElement('input');

        li.setAttribute('id', id);
        li.setAttribute('class', 'li-has-multiline li-has-checkbox')
        label.textContent = title;

        span.setAttribute('class', 'ui-li-sub-text li-text-sub');
        if (dialNumber !== undefined) {
            span.textContent = dialNumber
        } else {
            span.textContent = '';
        }

        input.setAttribute('type', 'checkbox');
        if (enabled === true) {
            input.checked = true;
        } else {
            input.checked = false;
        }

        label.appendChild(span);
        label.appendChild(input);
        li.appendChild(label)
        listElement.appendChild(li);
        console.log('list item added: ' + li);
    }

    function removeSoundListItem (id) {
        console.log('removeSoundListItem');

        var listItem = listElement.querySelector('#' + id);
        if (listItem) {
            console.log('list item deleted', listItem);
            listItem.remove();
            return true;
        }
        return false;
    }

    function refreshSwipeList () {
        if (swipeList) {
            swipeList.destroy();
            swipeList = null;
        }
        swipeList = tau.widget.SwipeList( listElement, {
            swipeTarget: "li",
            swipeElement: ".ui-swipelist",
            rtlStartColor : "#FF2200",
                /*
                 * ltrStartColor : #xx
                 * ltrEndColor : #xx
                 * rtlStartColor : #xx
                 * rtlEndColor : #xx
                 */
        });
    }

    function getSoundItemFromID(soundID) {
        return $('#sound-listview li[id=' + soundID +']')[0];
    }
    function listMatchHandler(event, soundID) {
        console.log('list matchHandler: ' + soundID);
        blink(getSoundItemFromID(soundID));
        // FIXME:: noti check
        var position = getLocation();
        var lat = '';
        var lng = '';
        if (position) {
            lat = position.coords.latitude + "";
            lng = position.coords.longitude + "";
        }
        var sound = listenerApp.getSoundById(soundID);
        var data = {
                Lat: lat,
                Lng: lng,
                Time: (new Date()).toLocaleTimeString(),
                Title: sound.title,
                // positon
                Phone: sound.dialNumber + "",
                Msg: sound.message
        }
        sendSocket(data);
    }

    listElement.addEventListener("swipelist.right", function(evt) {
        console.log('swipe right', evt.target);
        var list = evt.currentTarget;
        var target = evt.target;
        deleteTargetElem = target;
        tau.openPopup($('#sound-delete-popup')[0]);
    });

    // FIXME:: swipe left to modify
/*    var page = document.getElementById( "page-sound-info" );
    var openModifySoundPage = function (id) {
        currentSound = listenerApp.getSoundById(id);
        if (currentSound) {
            tau.changePage(page);
            _setValues(currentSound.title, currentSound.dialNumber, currentSound.message);
        }
    }
    function openModifyPage (soundID) {
       SoundInfoControl.openModifySoundPage(soundID);
//        tau.changePage(modifySoundPage);
    }
    listElement.addEventListener("swipelist.left", function(evt) {
       console.log('swipe left', evt.target);
       var id = evt.target.id;
       openModifyPage (id);
   });*/
 
    $('#soundlist-page').bind("pageshow", function() {
        console.log('pageshow');
        listenerApp.on('soundMatched', listMatchHandler);
        updateSoundList();
    });

    $('#soundlist-page').bind("pagebeforeshow", function() {
        console.log('pagebeforeshow');
    });

    $('#soundlist-page').bind("pagebeforehide", function() {
        console.log('pagebeforehide');

        // release handler
        console.log('off listMatchHandler');
        listenerApp.off('soundMatched', listMatchHandler);

        // release object
        if (swipeList) {
            swipeList.destroy();
            swipeList = null;
        }
    });

    $('#sound-delete-popup-cancel').bind('click', function() {
        tau.closePopup();
   });

   $('#sound-delete-popup-ok').bind('click', function() {
       if (deleteTargetElem !== null) {
           deleteSound(deleteTargetElem.id);
           deleteTargetElem.remove();
           deleteTargetElem = null;
       }
       tau.closePopup();
   });

    $('#addSoundBtn').bind('click', function() {
        tau.changePage($('#recording-sound-page')[0]);
    });

    var currentSound = null;

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

    $('#page-sound-info-btn-ok').bind('click', function() {
        if (currentSound) {
            currentSound.title = $('#page-sound-info-titile-input').val();
            currentSound.dialNumber = $('#page-sound-info-call-input').val();
            currentSound.message = $('#page-sound-info-message-input').val();
        }
        currentSound = null;
        tau.changePage($('#soundlist-page')[0]);
    });

    return {
        updateSoundList : updateSoundList
    };
}());
