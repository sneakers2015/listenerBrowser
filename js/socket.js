var Cast = (function() {
    var cast = new Broadcast(function(msg) {
        console.log('receive msg: ' + msg);
    });

    function strStartsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }

    return {
        cast : cast
    }
}());