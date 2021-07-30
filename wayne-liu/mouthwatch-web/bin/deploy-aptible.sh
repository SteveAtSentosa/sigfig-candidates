#!/usr/bin/env bash
set -euo pipefail

# add aptible's pubkey
cat > ~/.ssh/known_hosts <<-EOF
	
EOF

# push to aptible git remote
REMOTE_NAME="aptible_${APTIBLE_ENV}"
git remote remove ${REMOTE_NAME} || echo "No existing remote to remove"
git remote add ${REMOTE_NAME} ${APTIBLE_REMOTE}
git fetch ${REMOTE_NAME}
git push ${REMOTE_NAME} ${DEPLOY_TAG}:master --force
