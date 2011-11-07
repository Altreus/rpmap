$(function() {
    var credentials = {};

    function processConnect(response) {
        if (response.available) {
            $('#new-map-conf').data('overlay').load();

            $('#new-map-conf button.ok').click(function() {
                subscribe();
            });
            $('#new-map-conf button.cancel').click(function() {
                $('#new-map-conf').data('overlay').close();
            });
        }
    }

    function subscribe() {
        var client = new Faye.Client('http://localhost:8000/comet');
        var sub = client.subscribe('/map', function(message) {
            console.log(message);
        });

        sub.callback(function() {
        });

        sub.errback(function(error) {
            alert(error.message);
        });

        client.publish('/map', credentials);
    }

    $('#credentials').overlay({
        closeOnClick: false,
        closeOnEsc: false,
        load: true,
        mask: {
            color: '#ebecff',
            loadSpeed: 200,
            opacity: 0.9
        },
        oneInstance: false
    });

    $('#new-map-conf').overlay({
        closeOnClick: false,
        closeOnEsc: false,
        oneInstance: false
    });

    $('#credentials form').submit(function() {
        var $this = $(this).parent(),
            cn = $this.find('[name=charname]'),
            mn = $this.find('[name=mapname]'),
            ok = true;

        if (! $.trim(cn.val())) {
            cn.addClass('error');
            ok = false;
        }
        else {
            cn.removeClass('error');
        }

        if (! $.trim(mn.val())) {
            mn.addClass('error');
            ok = false;
        }
        else {
            mn.removeClass('error');
        }

        if (! ok) return false;

        credentials.character = cn.val();
        credentials.map = mn.val();

        $.get('http://localhost:8000/checkMap/' + credentials.map,
            processConnect, 'json');

        return false;
    });
});
