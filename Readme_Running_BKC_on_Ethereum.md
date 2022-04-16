# Running BKC node on Ethereum blockchain

All the information is from: https://www.youtube.com/watch?v=o90L6ksNW6g  and  https://www.youtube.com/watch?v=A5V2jdLi5mI

 ## 1-Install 
 
```e1
$ sudo apt install software-properties-common
```
```e2
$ sudo add-apt-repository -y ppa:ethereum/ethereum
```
```e2
$ sudo apt update
```
```e2
$ sudo apt install ethereum
```
```e2
$ geth version
```
```e2
$ sudo apt install nodejs
```
```e2
$ sudo apt install npm
```
```e2
$ sudo apt install curl
```
```e2
$ sudo apt install -y build-essential
```
```e2
$ node -v
```
```e2
$ npm - v
```
```e2
$ npm uninstall -g truffle
```
```e2
$ sudo npm install -g truffle
```
```e2
$ truffle version
```
```e2
$ wget -qO - https://packagecloud.io/AtomEditor/atom/gpgkey | sudo apt-key add -
```
```e2
$ sudo sh -c 'echo "deb [arch=amd64] https://packagecloud.io/AtomEditor/atom/any/ any main" > /etc/apt/sources.list.d/atom.list'
```
```e2
$ sudo apt update
```
```e2
$ sudo apt install atom
```
```e2
$ which atom
```
```e2
$ which apm
```
```e2
$ apm install language-ethereum
```
```e2
$ cd ~
```
```e2
$ mkdir ethereum
```
```e2
$ echo 'export ethereum_home=~/ethereum'>>~/.bash_profile
```
```e2
$ source ~/.bash_profile
```
```e2
$ cd ethereum
```
```e2
$ vi $ethereum_home/genesis.json

# paste this code with cmd v in edit mode
# Save with esc: !:wq
{
    "nonce": "0x0000000000000042",
    
    "timestamp": "0x0",
    
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x",
    "gasLimit": "0x8000000",
    "difficulty": "0x400",
    "config": {},
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
    "alloc": {}
}
```
```e2
# change eth_node
$ geth --datadir "$ethereum_home/eth_node" init "$ethereum_home/genesis.json"
```
```e2
$ cd eth_node
```
```e2
$ geth --datadir . account new
```
```e2
# add password
# write account password
# Save with esc: !:wq
$ vi $ethereum_home/eth_node/password.sec
```
```e2
# Change port number
$ nohup geth --datadir "$ethereum_home/eth_node" --port 30303 --nodiscover --ipcpath "$ethereum_home/eth_node/geth.ipc" --networkid 314159 --mine --miner.threads 1 --unlock 0 --password "$ethereum_home/eth_node/password.sec" 2> "$ethereum_home/geth.log" &
```

## 2- To open the ethereum consol from new terminal

```e2
# Type the command for your node 
$ geth attach ipc:$ethereum_home/blocklychain/geth.ipc
or
$ geth attach ipc:$ethereum_home/cpvanda/geth.ipc
or
$ geth attach ipc:$ethereum_home/eth_node/geth.ipc
or
$ geth attach ipc:$ethereum_home/<YOUR NODE>/geth.ipc
```
## 3- Some commands for ethereum consol
```e2
$ admin
```
```e2
$ admin.peers
```


