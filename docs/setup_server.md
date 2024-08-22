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

### systemd service example

[Unit]
<!-- describe the app -->
Description=Training Bot by Margo
<!-- start the app after the network is available -->
After=network.target

[Service]
<!-- usually you'll use 'simple' -->
<!-- one of https://www.freedesktop.org/software/systemd/man/systemd.service.html#Type= -->
Type=simple
<!-- which user to use when starting the app -->
User=root
<!-- path to your application's root directory -->
WorkingDirectory=/root/trainingbot
<!-- the command to start the app -->
<!-- requires absolute paths -->
ExecStart=/root/.bun/bin/bun run build/index.js
<!-- restart policy -->
<!-- one of {no|on-success|on-failure|on-abnormal|on-watchdog|on-abort|always} -->
Restart=always

[Install]
<!-- start the app automatically -->
WantedBy=multi-user.target

### journal service

`journalctl -u trainingbot.service --since today`