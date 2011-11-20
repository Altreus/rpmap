var maps = {};
var chars = {};

module.exports = {
    fayeExtension: {
        incoming: function(message, callback) {
            console.log('message');
            console.log(message);

            if (message.channel == '/meta/subscribe') {
                var map = message.subscription.substr(5);

                if (! maps[map]) {
                    maps[map] = {
                        ownerId: message.clientId
                    };
                }
            }

            if (message.channel.indexOf('/map') != -1) {
                if (!chars[message.clientId])
                    chars[message.clientId] = message.data;
            }

            return callback(message);
        }
    },

    checkMap: function(mapname) {
        console.log(mapname);
        console.log(maps);
        return maps[mapname] ? false : true;
    }
};
