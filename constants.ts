export const RAW_GUIDES_TEXT = `
# 🌐 Complete RPC Setup Guide (Reth + Prysm)

everything you need to run your own sepolia RPC node

this is the foundation for running aztec - get this right and you're halfway there

**prefer video format?** watch the full tutorial here: [YouTube Guide](https://youtu.be/ZadBvlpYV9I?si=O_WHqFKHBD6HM7Dw)

----------------- 

## why run your own RPC?

running your own RPC means:

∘ full control over your node's connectivity
∘ no rate limits or throttling
∘ better performance and reliability
∘ true decentralization

think of it as owning your infrastructure instead of renting

----------------- 

## 💻 hardware requirements

before buying a VPS, understand what you need:

### minimum specs (RPC only):
∘ 4 CPU cores
∘ 8GB RAM
∘ 1TB+ SSD (must be SSD, not HDD)
∘ root or sudo access

> this works if you ONLY run RPC alone

### recommended specs (RPC + Aztec together):
∘ 6+ CPU cores
∘ 16GB+ RAM
∘ 1TB+ SSD (must be SSD)
∘ root or sudo access
∘ OS: ubuntu 24

> need this if running both on same VPS

**critical notes:**
- for vCores, use at least double the physical cores
- HDD will kill your RPC performance - SSD is mandatory
- more storage is better (blockchain keeps growing)

----------------- 

## 🛒 purchasing VPS from servarica

### why servarica?

solid performance, accepts crypto, reliable uptime for node operators

### step-by-step purchase:

**1. visit the site**
   - go to [Servarica VPS](https://clients.servarica.com/aff.php?aff=1139)
   - click "KVM VPS" in navigation

**2. select plan**
   - scroll to **KVM FAT - Slice 6**
   - specs: 6 cores / 24GB RAM / 1.5TB SSD
   - perfect for RPC + aztec on same machine

**3. configuration**
   - hostname: anything you want
   - **OS: Ubuntu 24** (important!)
   - location: pick closest to you

**4. account setup**
   - new user: fill all details accurately
   - existing: just login
   - wrong address = rejected order

**5. payment**
   - choose "crypto payment"
   - connects through coinbase (secure)
   - accepts ETH or USDC on base/polygon/ethereum

**6. wait for credentials**
   - takes 4-5 hours
   - email will contain: IP, username, password
   - save these safely

----------------- 

## 📱 installing termius

termius is your access point to the VPS

### windows installation:
∘ open microsoft store
∘ search "termius"
∘ install and create account

### mac installation:
∘ download from app store or termius.com
∘ install and create account

### connecting to VPS:
1. open termius
2. click "new host"
3. fill in details:
   - label: name it (like "rpc-node")
   - address: your VPS IP
   - username: from email
   - password: from email
4. save and double-click to connect
5. you're in

----------------- 

## 🔧 VPS initial setup

now let's prepare your VPS properly

### enable root access:
\`\`\`bash
sudo sh -c 'echo "• Root Access Enabled ✔"'
\`\`\`

### update system:
\`\`\`bash
sudo apt-get update && sudo apt-get upgrade -y
\`\`\`

> if you see pink/purple screen, select option 1 and press enter

### install required packages:
\`\`\`bash
sudo apt install curl iptables build-essential git wget lz4 jq make gcc nano automake autoconf tmux htop nvme-cli libgbm1 pkg-config libssl-dev libleveldb-dev tar clang bsdmainutils ncdu unzip libleveldb-dev ufw screen gawk -y
\`\`\`

### install docker:

paste this entire script:

\`\`\`bash
#!/bin/bash
set -e

if [ ! -f /etc/os-release ]; then
  echo "Not Ubuntu or Debian"
  exit 1
fi

sudo apt update -y && sudo apt upgrade -y
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc docker-ce docker-ce-cli docker-buildx-plugin docker-compose-plugin; do
  sudo apt-get remove --purge -y $pkg 2>/dev/null || true
done
sudo apt-get autoremove -y
sudo rm -rf /var/lib/docker /var/lib/containerd /etc/docker /etc/apt/sources.list.d/docker.list /etc/apt/keyrings/docker.gpg

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings

. /etc/os-release
repo_url="https://download.docker.com/linux/$ID"
curl -fsSL "$repo_url/gpg" | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \\
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] $repo_url $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update -y && sudo apt upgrade -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

if sudo docker run hello-world; then
  sudo docker rm $(sudo docker ps -a --filter "ancestor=hello-world" --format "{{.ID}}") --force 2>/dev/null || true
  sudo docker image rm hello-world 2>/dev/null || true
  sudo systemctl enable docker
  sudo systemctl restart docker
  clear
  echo -e "\\u2022 Docker Installed \\u2714"
fi
\`\`\`

### setup firewall:
\`\`\`bash
sudo apt install -y ufw > /dev/null 2>&1
sudo ufw allow 22
sudo ufw allow ssh
sudo ufw enable
\`\`\`

> type "y" when prompted

----------------- 

## 🚀 installing RPC (automation script)

this is where the magic happens - automated installation

### run the installation:

\`\`\`bash
clear && if ! command -v screen >/dev/null 2>&1; then sudo apt install -y screen >/dev/null 2>&1 || true; fi
if ! command -v curl >/dev/null 2>&1; then sudo apt install -y curl >/dev/null 2>&1 || true; fi
screen -ls | grep 'rpc' | awk '{print $1}' | xargs -r -n1 -I {} screen -S {} -X quit >/dev/null 2>&1 || true
sleep 1
screen -ls | grep 'rpc' | awk '{print $1}' | cut -d. -f1 | xargs -r kill >/dev/null 2>&1 || true
screen -dmS rpc bash -c 'clear; bash <(curl -sLS https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/refs/heads/main/Reth-Prysm%20%3A%20Sepolia); exec bash' >/dev/null 2>&1 && screen -r rpc || echo "Failed to start 'rpc' screen session."
\`\`\`

### what happens now:

the script automatically:
- downloads reth (execution client)
- downloads prysm (consensus client)
- syncs with sepolia testnet
- configures everything properly

**sync time: 6-8 hours**

this used to take 3 days but now uses snapshot sync - much faster but still can't be rushed

### what you'll see:

installation steps will display on screen showing:
- downloading components
- initializing database
- starting sync process
- block numbers increasing

just let it run - don't close the terminal

----------------- 

## 📊 monitoring RPC logs

### method 1: dozzle (recommended)

**install dozzle:**
\`\`\`bash
docker run -d --name dozzle -v /var/run/docker.sock:/var/run/docker.sock -p 9999:8080 amir20/dozzle:latest
\`\`\`

**open firewall:**
\`\`\`bash
sudo ufw allow 9999
sudo ufw reload
\`\`\`

**access in browser:**
- open: \`http://YOUR-VPS-IP:9999\`
- replace YOUR-VPS-IP with actual IP
- you'll see reth & prysm containers
- real-time logs with clean interface

### method 2: CLI

\`\`\`bash
cd && cd Ethereum && docker compose logs -f reth prysm && cd
\`\`\`

**what to look for:**
- reth: "Imported blocks" with increasing numbers
- prysm: "Synced new block" messages
- both should show continuous activity

----------------- 

## ✅ checking RPC sync status

after 6-8 hours, verify sync completion

### run sync check:

\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/refs/heads/main/check%20RPC%20status)
\`\`\`

### what you need to see:

**sepolia RPC (port 8545):**
- status: synced ✅
- latest block should match current sepolia height

**beacon RPC (port 3500):**
- status: synced ✅
- head slot should be current

if both show synced with checkmarks, you're done and here's why it matters:

your RPC is now ready to serve aztec node or any other application that needs sepolia access

----------------- 

## 🔗 RPC endpoints

after sync completes, here are your endpoints:

### same VPS (RPC + aztec together):
- sepolia RPC: \`http://localhost:8545\`
- beacon RPC: \`http://localhost:3500\`

### separate VPS (RPC on different machine):
- sepolia RPC: \`http://YOUR-RPC-IP:8545\`
- beacon RPC: \`http://YOUR-RPC-IP:3500\`

> replace YOUR-RPC-IP with your RPC VPS IP address

----------------- 

## 🔒 UFW whitelist (optional security)

if you want to restrict access to specific IPs only

### use the whitelist tool:

\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/main/ufwWhitelistTool)
\`\`\`

### how it works:

**select option:**
- add IP: allows that IP to access RPC
- remove IP: denies that IP access

**enter details when prompted:**
- IP address: the IP you want to whitelist
- ports: enter \`8545,3500\` (comma separated)

**example:**
if I want to allow IP 123.45.67.89 access to both RPC ports:
1. select "add IP"
2. enter IP: 123.45.67.89
3. enter ports: 8545,3500
4. done

now only whitelisted IPs can access your RPC - everything else is blocked

----------------- 

## 🔍 RPC health check

regularly check your RPC health

### run health check:

\`\`\`bash
sudo bash -c 'bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/main/RPC%20Health%20Check)'
\`\`\`

### what it checks:

- both RPC endpoints responding
- sync status current
- peer connections healthy
- no errors in recent logs

green checkmarks = healthy RPC

----------------- 

## 🔄 updating RPC

when new versions release, update your RPC

### check for updates:

the automation script handles this - just run the installation command again:

\`\`\`bash
screen -dmS rpc bash -c 'clear; bash <(curl -sLS https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/refs/heads/main/Reth-Prysm%20%3A%20Sepolia); exec bash' >/dev/null 2>&1 && screen -r rpc
\`\`\`

it will:
- detect existing installation
- backup current data
- update to latest version
- resume sync from where it stopped

no need to resync from scratch

----------------- 

## 🗑️ cleanup / delete RPC

if you need to completely remove RPC

### run cleanup script:

\`\`\`bash
bash <(curl -fsSL https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/main/sepolia-RPC-cleanup)
\`\`\`

### select option 4:

this will:
- stop all RPC containers
- remove all RPC data
- clean up docker images
- free up disk space

only do this if you're sure - you'll need to resync everything

----------------- 

## 🚨 common RPC issues

### "sync stuck at same block"

**causes:**
- poor internet connection
- VPS specs too low
- disk I/O bottleneck

**fixes:**
- check internet speed (needs stable 25+ mbps)
- verify using SSD not HDD
- restart RPC: \`cd Ethereum && docker compose restart\`

### "out of disk space"

**solution:**
- RPC needs minimum 1TB
- clean old docker data: \`docker system prune -a\`
- consider upgrading VPS storage

### "RPC not responding"

**check:**
- is docker running: \`docker ps\`
- check logs for errors
- verify firewall not blocking ports
- restart: \`cd Ethereum && docker compose restart\`

### "high CPU usage"

**normal during:**
- initial sync
- catching up after downtime

**not normal if:**
- already synced but constantly high
- check for disk issues
- verify no other processes competing

----------------- 

## 💡 pro tips

**monitor regularly:**
- check dozzle dashboard daily
- run health check weekly
- watch for disk space

**backup nothing:**
- RPC data can always resync
- no private keys stored
- just redeploy if needed

**optimize performance:**
- use NVMe SSD if possible
- more RAM = better caching
- stable internet is crucial

**plan for growth:**
- blockchain keeps growing
- 1TB is minimum today
- consider 2TB+ for future

**keep it updated:**
- new client versions fix bugs
- improve sync speed
- better resource usage

----------------- 

## 📝 quick reference

**important ports:**
- 8545: sepolia execution RPC
- 3500: beacon consensus RPC
- 9999: dozzle dashboard

**key commands:**
- sync check: \`bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/refs/heads/main/check%20RPC%20status)\`
- health check: \`sudo bash -c 'bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/main/RPC%20Health%20Check)'\`
- view logs: \`cd Ethereum && docker compose logs -f reth prysm\`
- restart: \`cd Ethereum && docker compose restart\`

**data location:**
- ethereum data: \`/root/.aztec/\`
- docker compose: \`/root/Ethereum/\`

----------------- 

## 🙏 credits & support

**video guide created by:** @xanonxbt
∘ X (Twitter): [https://x.com/xanonxbt](https://x.com/xanonxbt)
∘ Discord: @xanonxbt
∘ Full video tutorial: [YouTube](https://youtu.be/ZadBvlpYV9I?si=O_WHqFKHBD6HM7Dw)

**setup scripts & automation by:** Creed (@web3.creed)
∘ huge thanks for the amazing tools that made this possible
∘ RPC Guide: [https://web3creed.gitbook.io/aztec-guide/rpc-node/rpc-setup-guide](https://web3creed.gitbook.io/aztec-guide/rpc-node/rpc-setup-guide)
∘ Complete Aztec Guide: [https://web3creed.gitbook.io/aztec-guide](https://web3creed.gitbook.io/aztec-guide)

**need help?**
- ping me (@xanonxbt) in aztec discord
- or mention @web3.creed in help-desk
- we're both active and ready to help

(please use public channels, not DMs - so others can learn too)

----------------- 

your RPC is now ready to power your aztec node

the 6-8 hour wait is worth it - you now have full control over your infrastructure

next step: setting up aztec node using this RPC

see you in the next guide

GUIDE_SEPARATOR

# 🎯 Complete Aztec Sequencer Node Setup

everything you need to run an aztec validator node

this assumes you already have RPC running (check the RPC guide first if you don't)

**prefer video format?** watch the full tutorial here: [YouTube Guide](https://youtu.be/ZadBvlpYV9I?si=O_WHqFKHBD6HM7Dw)

----------------- 

## 📋 prerequisites checklist

before starting, make sure you have:

∘ RPC fully synced (both sepolia + beacon)
∘ 0.2-0.5 sepolia ETH in a wallet
∘ fresh wallet (not your main one)
∘ wallet private key and address ready
∘ VPS with proper specs

if any of these are missing, stop and get them first

----------------- 

## 💻 hardware requirements

### minimum specs (aztec only):
∘ 4 CPU cores
∘ 8GB RAM
∘ 250GB SSD
∘ linux or macOS
∘ 25 mbps up/down network

### recommended specs (aztec + RPC):
∘ 6+ CPU cores
∘ 16GB+ RAM
∘ 1TB+ SSD
∘ linux (ubuntu 24)
∘ stable internet

> if running both on same VPS, use recommended specs

----------------- 

## 🔐 preparing your credentials

grab a notepad and organize this info securely:

### what you need:

**sepolia RPC:**
- same VPS: \`http://localhost:8545\`
- different VPS: \`http://RPC-IP:8545\`

**beacon RPC:**
- same VPS: \`http://localhost:3500\`
- different VPS: \`http://RPC-IP:3500\`

**wallet private key:**
- format: \`0xabc123def456...\`
- use NEW wallet, not main
- keep this secret

**wallet address:**
- format: \`0x1234567890...\`
- matches the private key above
- fund with 0.2-0.5 sepolia ETH

**VPS IP address:**
\`\`\`bash
curl ipv4.icanhazip.com
\`\`\`
save this output

> never share private key with anyone - this controls your validator

----------------- 

## 🔥 firewall configuration

aztec needs specific ports open

### configure firewall:

\`\`\`bash
sudo apt install -y ufw > /dev/null 2>&1
# basic firewall
sudo ufw allow 22
sudo ufw allow ssh
sudo ufw enable
# aztec ports
sudo ufw allow 40400/tcp
sudo ufw allow 40400/udp
sudo ufw allow 8080
sudo ufw reload
\`\`\`

> type "y" when prompted

### port explanation:

- **8080**: aztec node API
- **40400/tcp**: p2p communication
- **40400/udp**: p2p discovery (most important)

the UDP port is what most people forget - don't skip it

----------------- 

## 🧹 clean slate setup

remove any old installations first

### cleanup old data:

\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/refs/heads/main/Aztec%20CLI%20Cleanup)
\`\`\`

this removes:
- old containers
- previous data
- conflicting configs

### create fresh directory:

\`\`\`bash
rm -rf aztec && mkdir aztec && cd aztec && echo "Directory Created ✓" && echo "Changed Directory ✓"
\`\`\`

you're now in a clean aztec folder

----------------- 

## ⚙️ configuration files

### create environment file:

\`\`\`bash
nano .env
\`\`\`

### paste this template:

\`\`\`bash
ETHEREUM_RPC_URL=Sepolia-RPC
CONSENSUS_BEACON_URL=Beacon-RPC
VALIDATOR_PRIVATE_KEYS=0xYourPrivateKey
COINBASE=0xYourAddress
P2P_IP=Your-IP-Address
\`\`\`

### now fill in YOUR actual values:

**example of properly filled .env:**

\`\`\`bash
ETHEREUM_RPC_URL=http://localhost:8545
CONSENSUS_BEACON_URL=http://localhost:3500
VALIDATOR_PRIVATE_KEYS=0xabc123def456789...
COINBASE=0x1234567890abcdef...
P2P_IP=123.45.67.89
\`\`\`

**critical points:**
- use \`localhost\` if RPC on same VPS
- use actual RPC IP if on different VPS
- private key must start with 0x
- wallet address must start with 0x
- IP must be your VPS public IP

> **save file**: press \`Ctrl + O\`, hit \`Enter\`, then \`Ctrl + X\`

----------------- 

## 🐳 docker compose setup

### create docker-compose.yml:

\`\`\`bash
nano docker-compose.yml
\`\`\`

### paste this exactly (no changes needed):

\`\`\`yaml
services:
  aztec-node:
    container_name: aztec-sequencer
    image: aztecprotocol/aztec:2.0.2
    restart: unless-stopped
    network_mode: host
    environment:
      ETHEREUM_HOSTS: \u0024{ETHEREUM_RPC_URL}
      L1_CONSENSUS_HOST_URLS: \u0024{CONSENSUS_BEACON_URL}
      DATA_DIRECTORY: /data
      VALIDATOR_PRIVATE_KEYS: \u0024{VALIDATOR_PRIVATE_KEYS}
      COINBASE: \u0024{COINBASE}
      P2P_IP: \u0024{P2P_IP}
      LOG_LEVEL: info
    entrypoint: >
      sh -c 'node --no-warnings /usr/src/yarn-project/aztec/dest/bin/index.js start --network testnet --node --archiver --sequencer'
    ports:
      - 40400:40400/tcp
      - 40400:40400/udp
      - 8080:8080
    volumes:
      - /root/.aztec/testnet/data/:/data
\`\`\`

> **save file**: press \`Ctrl + O\`, hit \`Enter\`, then \`Ctrl + X\`

----------------- 

## 🚀 starting your node

### launch the node:

\`\`\`bash
docker compose up -d
\`\`\`

this starts the container in detached mode (runs in background)

### verify it's running:

\`\`\`bash
docker ps
\`\`\`

you should see \`aztec-sequencer\` container with status "Up"

----------------- 

## 📊 monitoring your node

### method 1: CLI logs (quick check)

\`\`\`bash
docker compose logs -fn 1000
\`\`\`

**what to look for:**
- \`"Downloaded L2 Block xxxxxx"\` ← this is what you want to see
- block numbers should keep increasing
- no error messages repeating

press \`Ctrl + C\` to exit logs

### method 2: dozzle (visual dashboard)

if you set up dozzle during RPC installation, access it at:
- \`http://YOUR-VPS-IP:9999\`

you'll see the \`aztec-sequencer\` container with live logs - much easier to read

### method 3: sync status check

open a new terminal tab (\`Ctrl + T\`) and run:

\`\`\`bash
bash <(curl -s https://raw.githubusercontent.com/cerberus-node/aztec-network/refs/heads/main/sync-check.sh)
\`\`\`

**look for:**
- progress: 100% ← fully synced
- current block matches latest network block
- sync speed should be steady

----------------- 

## 🔍 verifying node health

### check peer ID visibility:

your node needs to be discoverable on the network

**visit:** [https://aztec.nethermind.io](https://aztec.nethermind.io)

**search for:** your VPS IP address or wallet address

**you should see:**
- your peer ID listed
- status: active
- blocks synced

if you don't see your peer ID, there's likely a port issue (check troubleshooting below)

### check transaction activity:

healthy nodes show:
- regular block downloads
- peer connections (10+ peers is good)
- no repeated errors
- stable memory usage

----------------- 

## 🏆 claiming discord roles

### join aztec discord:

first, join the [Aztec Discord Server](https://discord.gg/gJc26KWD4f)

### step 1: apprentice role

1. go to **"operators | start-here"** channel
2. react to the pinned message
3. you'll automatically get apprentice role

### step 2: guardian role

guardian roles are based on periodic snapshots by the team

**requirements:**
- peer ID visible on [aztec.nethermind.io](https://aztec.nethermind.io)
- node running for 72+ hours before snapshot
- node still online during snapshot
- wallet has sufficient sepolia ETH

**how to check eligibility:**

1. go to **"update-role"** channel
2. type \`/checkip\` and click the popup
3. enter your VPS IP address
4. enter your wallet address
5. check results:
   - ✅ eligible → you'll get guardian role
   - ❌ not eligible → keep running, wait for next snapshot

**tips for guardian role:**
- keep node running 24/7
- monitor uptime regularly
- ensure RPC stays synced
- watch for team snapshot announcements
- maintain healthy peer connections

----------------- 

## 🚨 troubleshooting common issues

### "peer ID not showing on nethermind"

this is the most common issue - it's almost always port 40400/udp

**fix:**

1. verify firewall rules:
\`\`\`bash
sudo ufw status verbose
\`\`\`

should show:
- 40400/tcp ALLOW
- 40400/udp ALLOW

2. if missing, add them:
\`\`\`bash
sudo ufw allow 40400/tcp
sudo ufw allow 40400/udp
sudo ufw reload
\`\`\`

3. check port is open externally:
- visit [https://portchecker.co](https://portchecker.co)
- enter your VPS IP and port 40400
- should show "open"

4. restart node:
\`\`\`bash
cd aztec && docker compose restart
\`\`\`

5. wait 30 minutes and check nethermind again

### "node keeps restarting"

**check logs for errors:**
\`\`\`bash
docker compose logs -fn 100
\`\`\`

**common causes:**
- insufficient sepolia ETH (need 0.2-0.5)
- wrong private key format
- RPC not synced or down
- incorrect RPC endpoints in .env

**fix:**
1. verify .env file has correct info
2. check RPC is synced:
\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/refs/heads/main/check%20RPC%20status)
\`\`\`
3. ensure wallet has ETH
4. restart node after fixing

### "not syncing / stuck at same block"

**possible causes:**
- RPC issues
- network connectivity
- peer connection problems

**fix:**

1. check RPC health:
\`\`\`bash
sudo bash -c 'bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/main/RPC%20Health%20Check)'
\`\`\`

2. verify internet is stable

3. check peer count in logs:
\`\`\`bash
docker compose logs | grep -i peer
\`\`\`

4. restart if needed:
\`\`\`bash
docker compose restart
\`\`\`

### "high memory usage"

**normal if:**
- during initial sync
- processing large blocks
- catching up after downtime

**not normal if:**
- memory keeps growing endlessly
- VPS becomes unresponsive

**fix:**
- upgrade VPS to 16GB+ RAM
- monitor with: \`htop\`
- restart node: \`docker compose restart\`

### "connection refused errors"

**check:**
1. is RPC actually running?
\`\`\`bash
curl http://localhost:8545
\`\`\`

2. is docker running?
\`\`\`bash
docker ps
\`\`\`

3. are endpoints correct in .env?
- should be localhost:8545 if same VPS
- should be RPC-IP:8545 if different VPS

----------------- 

## 🔄 updating your node

when aztec releases new versions:

### check current version:
\`\`\`bash
docker compose logs | head -n 20
\`\`\`

### update to latest:

1. stop current node:
\`\`\`bash
docker compose down
\`\`\`

2. edit docker-compose.yml:
\`\`\`bash
nano docker-compose.yml
\`\`\`

3. change image version:
\`\`\`yaml
image: aztecprotocol/aztec:NEW_VERSION_HERE
\`\`\`

4. save and restart:
\`\`\`bash
docker compose up -d
\`\`\`

5. monitor logs:
\`\`\`bash
docker compose logs -fn 1000
\`\`\`

your data persists, so no need to resync from scratch

----------------- 

## 🗑️ complete node removal

if you need to start fresh:

### run cleanup:
\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/refs/heads/main/Aztec%20CLI%20Cleanup)
\`\`\`

this removes:
- all containers
- all node data
- docker images
- frees disk space

then follow the installation steps again from the beginning

----------------- 

## 💡 pro tips for success

**maintain 24/7 uptime:**
- guardian role depends on it
- use reliable VPS provider
- monitor regularly

**keep RPC healthy:**
- aztec node is only as good as its RPC
- run health checks weekly
- restart RPC if needed

**watch your wallet balance:**
- need minimum 0.2 sepolia ETH
- refill before it runs out
- set alerts if possible

**join the community:**
- aztec discord is your best resource
- team announces snapshots there
- other operators share tips
- get help quickly

**monitor logs daily:**
- check for errors
- verify sync progress
- ensure peer connections stable
- catch issues early

**backup your .env file:**
- save it somewhere safe
- you'll need it if you migrate VPS
- never share it publicly

----------------- 

## 📝 quick command reference

**start node:**
\`\`\`bash
cd aztec && docker compose up -d
\`\`\`

**stop node:**
\`\`\`bash
cd aztec && docker compose down
\`\`\`

**restart node:**
\`\`\`bash
cd aztec && docker compose restart
\`\`\`

**view logs:**
\`\`\`bash
cd aztec && docker compose logs -fn 1000
\`\`\`

**check sync status:**
\`\`\`bash
bash <(curl -s https://raw.githubusercontent.com/cerberus-node/aztec-network/refs/heads/main/sync-check.sh)
\`\`\`

**check RPC status:**
\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Sepolia-RPC-Setup/refs/heads/main/check%20RPC%20status)
\`\`\`

**check RPC health:**
\`\`\`bash
sudo bash -c 'bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/main/RPC%20Health%20Check)'
\`\`\`

**cleanup everything:**
\`\`\`bash
bash <(curl -Ls https://raw.githubusercontent.com/DeepPatel2412/Aztec-Tools/refs/heads/main/Aztec%20CLI%20Cleanup)
\`\`\`

----------------- 

## 📊 important locations

**node data:**
- \`/root/.aztec/testnet/data/\`

**config files:**
- \`/root/aztec/.env\`
- \`/root/aztec/docker-compose.yml\`

**logs access:**
- dozzle: \`http://YOUR-IP:9999\`
- CLI: \`docker compose logs -fn 1000\`

**monitoring:**
- nethermind: [https://aztec.nethermind.io](https://aztec.nethermind.io)
- sync check: use command above

----------------- 

## 🎯 success checklist

before claiming you're done, verify:

✅ RPC fully synced (both sepolia + beacon)
✅ aztec node container running
✅ logs show "Downloaded L2 Block" messages
✅ block numbers increasing steadily
✅ peer ID visible on nethermind.io
✅ port 40400 shows open on portchecker.co
✅ wallet has 0.2+ sepolia ETH
✅ no errors repeating in logs
✅ dozzle dashboard accessible (if installed)
✅ sync check shows 100% progress

if all checked, you're successfully running an aztec sequencer node

----------------- 

## 🙏 credits & support

**video guide created by:** @xanonxbt
∘ X (Twitter): [https://x.com/xanonxbt](https://x.com/xanonxbt)
∘ Discord: @xanonxbt
∘ Full video tutorial: [YouTube](https://youtu.be/ZadBvlpYV9I?si=O_WHqFKHBD6HM7Dw)

**setup scripts & automation by:** Creed (@web3.creed)
∘ huge thanks for the incredible tools and guides
∘ RPC Setup Guide: [https://web3creed.gitbook.io/aztec-guide/rpc-node/rpc-setup-guide](https://web3creed.gitbook.io/aztec-guide/rpc-node/rpc-setup-guide)
∘ Complete Aztec Guide: [https://web3creed.gitbook.io/aztec-guide](https://web3creed.gitbook.io/aztec-guide)

**need help?**
- ping me (@xanonxbt) in aztec discord
- or mention @web3.creed in help-desk channel
- we're both active and here to help

(please use public channels instead of DMs - so everyone can learn from the answers)

----------------- 

congrats on setting up your aztec sequencer node

you're now part of the decentralized aztec network

keep your node running 24/7 for best chances at guardian role

see you on the network anon
`;
