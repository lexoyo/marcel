#!/bin/sh

# comes from here https://www.freshrelevance.com/blog/server-monitoring-with-a-raspberry-pi-and-graphite
# does not work: 
# tvservice --preferred > /dev/null
# fbset -depth 8; fbset -depth 16; xrefresh -d :0.0

# comes from https://github.com/alexyak/motiondetector/blob/89a81726714b3ce169a1edaf9311b48579d9594a/node_helper.js#L26
/opt/vc/bin/tvservice --preferred 
sudo chvt 6 && sudo chvt 7

