var maps = {};

module.exports = {
    fayeExtension: {
        incoming: function(message, callback) {
            console.log(message);
            if (message.channel != '/map') 
                return callback(message);

            return callback(message);
        }
    },

    checkMap: function(mapname) {
        return maps[mapname] ? false : true;
    }
};
