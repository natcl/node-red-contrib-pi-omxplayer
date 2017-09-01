const omxp = require('omxplayer-controll');

module.exports = function(RED) {
    function omxControl(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.filename = config.filename;

        var opts = {
            'audioOutput': 'alsa:hw:1,0',
            'blackBackground': false,
            'disableKeys': true,
            'disableOnScreenDisplay': true,
            'disableGhostbox': true,
            'subtitlePath': '',
            'startAt': 0,
            'startVolume': 0.8,
            'closeOtherPlayers': true //Should close other players if necessary
        };

        this.on('input', function(msg) {
            var filename = node.filename || msg.filename || "";

            if (msg.payload == 'play') {
                if (filename == ""){
                    node.warn('No filename provided.');
                    return;
                } else {
                    omxp.open(filename, opts);
                }
            }
            if (msg.payload == 'playpause') {
                omxp.playPause(function(err){
                    if (err) node.error(err, msg);
                });
            }
            if (msg.payload == 'pause') {
                omxp.pause(function(err){
                    if (err) node.error(err, msg);
                });
            }
        });

        omxp.on('finish', function() {
            node.warn('============= Finished =============');
        });
    }
    RED.nodes.registerType("rpi-omxplayer", omxControl);
};
