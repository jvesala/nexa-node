#!/bin/bash -e
DIR=`dirname "$(readlink -f "$0")"`
cd ${DIR}/..

tmux new-session -s nexa-node -d
tmux new-window -t nexa-node:1 -n run-nexa-node
tmux send-keys -t nexa-node:1 "node app.js" Enter
#tmux attach -t nexa-node
