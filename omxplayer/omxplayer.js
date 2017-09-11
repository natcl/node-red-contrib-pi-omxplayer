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
        node.loop = config.loop;
        node.subtitlepath = config.subtitlepath;

        var opts = {
            'audioOutput': node.audiooutput || 'hdmi',
            'blackBackground': node.blackbackground,
            'disableKeys': node.disablekeys,
            'disableOnScreenDisplay': node.disableosd,
            'disableGhostbox': node.disableghostbox,
            'loop': node.loop,
            'subtitlePath': node.subtitlepath || '',
            'startAt': 0,
            'startVolume': 0.8,
            'closeOtherPlayers': true //Should close other players if necessary
        };

        node.on('input', msg => {
            var filename = node.filename || msg.filename || "";

            if (msg.payload == 'open') {
                if (filename == ""){
                    node.warn('No filename provided.');
                    return;
                } else {
                    omxp.open(filename, opts);
                }
            }
            if (msg.payload == 'playpause') {
                omxp.playPause(err => {
                    if (err){
                        node.error(err, msg);
                    } else {
                        setTimeout(updateStatus, 100);
                    }
                });
            }
            if (msg.payload == 'pause') {
                omxp.pause(err => {
                    if (err) {
                        node.error(err, msg);
                    } else {
                        setTimeout(updateStatus, 100);
                    }
                });
            }
            if (msg.payload == 'stop') {
                omxp.stop(err => {
                    if (err) {
                        node.error(err, msg);
                    } else {
                        node.status({fill:"red",shape:"dot",text:"Stopped"});
                    }
                });
            }
            if (msg.payload == 'volumeup') {
                omxp.volumeUp(err => {
                    if (err) node.error(err, msg);
                });
            }
            if (msg.payload == 'volumedown') {
                omxp.volumeDown(err => {
                    if (err) node.error(err, msg);
                });
            }
            if (msg.payload == 'getduration') {
                omxp.getDuration((err, duration) => {
                    if (duration) {
                        msg.status = {};
                        msg.status.duration = duration;
                        node.send(msg);
                    } else {
                        node.error(err);
                    }
                });
            }
            if (msg.payload == 'getposition') {
                omxp.getPosition((err, position) => {
                    if (position) {
                        msg.status = {};
                        msg.status.pos = position;
                        node.send(msg);
                    } else {
                        node.error(err);
                    }
                });
            }
            if (msg.payload == 'getstatus') {
                omxp.getStatus((err, status) => {
                    if (status) {
                        msg.status = {};
                        msg.status.status = status;
                        node.send(msg);
                    } else {
                        node.error(err);
                    }
                });
            }
            if (msg.payload == 'getvolume') {
                omxp.getVolume((err, volume) => {
                    if (volume) {
                        msg.status = {};
                        msg.status.vol = volume;
                        node.send(msg);
                    } else {
                        node.error(err);
                    }
                });
            }
            if (msg.payload.startsWith('setvolume')) {
                var volume = parseFloat(msg.payload.split(' ')[1]);
                if (volume > 1) volume = 1;
                if (volume < 0) volume = 0;
                omxp.setVolume(volume, (err, volume) => {
                    if (err) node.error(err);
                });
            }
            if (msg.payload.startsWith('setposition')) {
                var position = parseInt(msg.payload.split(' ')[1]);
                omxp.setPosition(position, err => {
                    if (err) node.error(err);
                });
            }
        });

        function updateStatus() {
            omxp.getStatus((err, status) => {
                if (status) {
                    switch (status) {
                        case 'Playing':
                            node.status({fill:"green",shape:"dot",text:"Playing"});
                            break;
                        case 'Stopped':
                            node.status({fill:"red",shape:"dot",text:"Stopped"});
                            break;
                        case 'Paused':
                            node.status({fill:"gray",shape:"dot",text:"Paused"});
                            break;
                    }
                }

            });
        }

        omxp.on('changeStatus', (status) => {
            switch (status.status) {
                case 'Playing':
                    node.status({fill:"green",shape:"dot",text:"Playing"});
                    break;
                case 'Stopped':
                    node.status({fill:"red",shape:"dot",text:"Stopped"});
                    break;
                case 'Paused':
                    node.status({fill:"gray",shape:"dot",text:"Paused"});
                    break;
            }
            var msg = {};
            msg.status = status;
            node.send(msg);
        });

        omxp.on('finish', () => {
            node.status({fill:"red",shape:"dot",text:"Stopped"});
            var msg = {};
            msg.status = {};
            msg.status.status = 'Stopped';
            node.send(msg);
            cleanup();
        });

        node.on('close', () => {
            cleanup();
        });
        
        function cleanup() {
            omxp.removeAllListeners('finish');
            omxp.removeAllListeners('changeStatus');
        }
    }
    RED.nodes.registerType("rpi-omxplayer", omxControl);
};
