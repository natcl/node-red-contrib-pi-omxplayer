var pm2 = require('omxplayer-controll');

module.exports = function(RED) {
    function omxControl(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function(msg) {

        });
    }
    RED.nodes.registerType("rpi-omxplayer", omxControl);
};
