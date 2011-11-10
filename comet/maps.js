var maps = {};

function handleDataMessage(message) {
    var data = message.data;


    if (data.character && data.map && !maps[data.map]) {
        maps[data.map] = {
            character: data.character,
            ownerId: message.clientId
        };
    }
}

module.exports = {
    fayeExtension: {
        incoming: function(message, callback) {
            console.log(message);
            if (message.channel != '/map') 
                return callback(message);

            if (message.data) {
                handleDataMessage(message);
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
