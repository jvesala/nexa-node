Add following lines to /etc/rc.local (change to proper directory)

echo "Starting nexa-node tmux..."
su pi -c "/opt/nexa-node/script/nexa-node-startup.sh"
echo "...nexa-node started."

