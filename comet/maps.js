var maps = {};
var chars = {};

var handlers = {
    hail: function(message) {
        console.log('new char "' + message.data.character + '"');
        chars[message.clientId] = message.data;
    },
    update: function(message) {
        var map = message.channel.substr(5),
            data = message.data;
        map = maps[map];

        // If this is our map we change the object data held.
        map.objects = map.objects || {};
        map.objectOrder = map.objectOrder || [];
        var data = message.data;

        if (!map.objects[data.id]) {
            // New object? Append it to the order array too.
            map.objects[data.id] = data;
            map.objectOrder.push(data.id);
        }
        else {
            // Existing object? Change the definition string.
            map.objects[data.id].data = data.data;
        }
    },
    fetch: function(map) {
        // existing map? You get ALL the things!
        console.log('serving existing map "' + map + '"');
        console.log(map);

        return {
            objects: maps[map].objects,
            order:   maps[map].objectOrder
        };
    }
};

module.exports = {
    fayeExtension: {
        incoming: function(message, callback) {
//            console.log('message');
              //console.log(message);
            console.log('start');

            if (message.channel == '/meta/subscribe') {
                var map = message.subscription.substr(5);

                if (! maps[map]) {
                    // New map? Assign it to this client ID. When the
                    // first data message arrives, that will set up the
                    // reverse mapping.
                    console.log('creating new map "' + map + '"');
                    maps[map] = {
                        ownerId: message.clientId
                    };
                }
            }

            if (message.channel.indexOf('/map') != -1) {
                var map = message.channel.substr(5),
                    clientId = message.clientId,
                    type = message.data.type;

                handlers[type](message);
            }

            console.log('end');
            return callback(message);
        }
    },

    checkMap: function(mapname) {
        return maps[mapname] ? false : true;
    },

    fetch: handlers.fetch
};
