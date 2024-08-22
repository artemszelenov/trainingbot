# setup server

## steps

1. install git (if not)
2. pull the repo
3. install bun
4. install deps
5. build
6. migrate
7. seed
8. install and config ufw
9. install and config caddy
10. run app as a service

### ufw

`sudo ufw allow http`
`sudo ufw allow https`
`sudo ufw allow OpenSSH`
`sudo ufw allow proto tcp from any to any port 80,443`

### local backup from remote server to my mac

`rsync -avz root@95.213.229.42:/root/trainingbot/sqlite/data.sqlite /Users/artemzelenov/Developer/TrainingBot/sqlite/backups/`
