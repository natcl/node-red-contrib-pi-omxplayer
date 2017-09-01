const omxp = require('omxplayer-controll');

module.exports = function(RED) {
    function omxControl(config) {
        RED.nodes.createNode(this, config);
        var node = this;

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
            if (msg.payload == 'play') {
                omxp.open('/home/pi/source/2017_mnk/openframeworks/myApps/MF-MNK-VideoArtnet/bin/data/video/test_1080.mov', opts);
            }
            if (msg.payload == 'playpause') {
                omxp.playPause(function(err){
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
