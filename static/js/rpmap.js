$(function() {
    var PseudoGuid = new (function() {
        var fourChars = function() {
                return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1).toUpperCase();
        };
        this.empty = "00000000-0000-0000-0000-000000000000";
        this.GetNew = function() {
            return (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
        };
    })();

    var credentials = {},
        client,
        created = {};

    function processConnect(response) {
        if (response.available) {
            $('#new-map-conf').data('overlay').load();

            $('#new-map-conf button.ok').click(function() {
                subscribe();
                $('#new-map-conf').data('overlay').close();
                $('#credentials').data('overlay').close();
            });
            $('#new-map-conf button.cancel').click(function() {
                $('#new-map-conf').data('overlay').close();
            });
        }
        else { 
            subscribe();
            $('#credentials').data('overlay').close();
        }
    }

    function subscribe() {
        client = new Faye.Client('http://localhost:8000/comet');
        var sub = client.subscribe('/map/' + credentials.map, 
            function(data) {
                if (! data.id) return;

                // don't do this if we're the one who created it
                if (! created[data.id]) {
                    if (! $('#' + data.id).length) {
                        $('#map')
                            .data('drawing')
                            .createObject({ 
                                tool: data.tool, 
                                data: data.data,
                                id: data.id
                            });
                    }
                    else {
                        $('#map')
                            .data('drawing')
                            .updateObject({ 
                                tool: data.tool, 
                                data: data.data,
                                id: data.id
                            });

                    }
                }
            });

        sub.callback(function() {
            console.log('connected OK');
        });

        sub.errback(function(error) {
            alert(error.message);
        });

        client.publish('/map/' + credentials.map, credentials);
    }

    $(document).bind('drawing.begin', function(e, f) {
        if (! f.element.node.id) {
            var tempId = PseudoGuid.GetNew();
            f.element.node.id = tempId;
        }

        if (! created[f.element.node.id]) {
            created[f.element.node.id] = f.element;
        }
    });

    $(document).bind('drawing.change', function(e,f) {
        client.publish('/map/' + credentials.map, {
            tool: $(f.element.node).data('tool'),
            data: f.element.attr('path') + "",
            type: 'update',
            id: f.element.node.id
        });
    });
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
