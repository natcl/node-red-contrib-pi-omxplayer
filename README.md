# node-red-contrib-pi-omxplayer

A Node-RED node to control OMXPlayer on the Raspberry pi

This node will accept the following commands as `msg.payload`:

- open
- playpause
- pause
- stop
- volumeup
- volumedown
- getduration
- getposition
- getstatus
- getvolume
- setvolume float (0-1)
- setposition int

The file to play can be set either in the node configuration or by using `msg.filename`.

The filename set in the configuration has precedence over `msg.filename`.

The node will output it's current status periodically in the `msg.status` object.
Calls to the different getter functions will also return a `msg.status` object.
