const omxp = require('omxplayer-controll');

module.exports = function(RED) {
    function omxControl(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.filename = config.filename;
        node.audiooutput = config.audiooutput;
        node.blackbackground = config.blackbackground;
        node.disablekeys = config.disablekeys;
        node.disableosd = config.disableosd;
        node.disableghostbox = config.disableghostbox;
        node.subtitlepath = config.subtitlepath;

        var opts = {
            'audioOutput': node.audiooutput || 'hdmi',
            'blackBackground': node.blackbackground,
            'disableKeys': node.disablekeys,
            'disableOnScreenDisplay': node.disableosd,
            'disableGhostbox': node.disableghostbox,
            'subtitlePath': node.subtitlepath || '',
            'startAt': 0,
            'startVolume': 0.8,
            'closeOtherPlayers': true //Should close other players if necessary
        };

        node.on('input', function(msg) {
            var filename = node.filename || msg.filename || "";

            if (msg.payload == 'open') {
                if (filename == ""){
                    node.warn('No filename provided.');
                    return;
                } else {
                    omxp.open(filename, opts);
                    // omxp.getStatus(function(err, status){
                    //     node.warn(status);
                    //     if (status == 'Playing') {
                    //         node.status({fill:"green",shape:"dot",text:"Playing..."});
                    //     }
                    // });
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
            if (msg.payload == 'stop') {
                omxp.stop(function(err){
                    if (err) node.error(err, msg);
                });
            }
            if (msg.payload == 'volumeup') {
                omxp.volumeUp(function(err){
                    if (err) node.error(err, msg);
                });
            }
            if (msg.payload == 'volumedown') {
                omxp.volumeDown(function(err){
                    if (err) node.error(err, msg);
                });
            }
            if (msg.payload == 'getduration') {
                omxp.getDuration(function(err, duration){
                    node.warn(duration);
                });
            }
            if (msg.payload == 'getstatus') {
                omxp.getStatus(function(err, status){
                    node.warn(status);
                });
            }
        });

        omxp.on('finish', function() {
            node.warn('============= Finished =============');
        });

        node.on('close', function() {
            omxp.removeAllListeners('finish');
        });
    }
    RED.nodes.registerType("rpi-omxplayer", omxControl);
};
