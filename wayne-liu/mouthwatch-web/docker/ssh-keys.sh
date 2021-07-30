mkdir -p ~/.ssh
cp -r /root/.ssh-keys/* ~/.ssh/
cat /dev/null > ~/.ssh/known_hosts
ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
chown -R $(id -u):$(id -g) ~/.ssh
