const contractAddress = '0xfc6701f3d215a98a3d15b922FFF9Bc60bed37EB9';
var connAccount;
var myContract;
var web3;

$(function(){
    if (typeof ethereum.isMetaMask !== 'undefined') {
        eth_requestAccounts();
    }else{
        alert('请先安装 MetaMask');
        return;
    }
});

// 读取 jsonInterface
function initMyContract(callback){
    $.getJSON('../data/vote.json', function(res){
        // http://pdmfs.aboshe.cn/a0/a0/a6daczdub5492b7h.json
        jsonInterface = res.output.abi;
        web3 = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        myContract = new web3.eth.Contract(jsonInterface, contractAddress);
        if (callback){
            callback();
        }
    })
}

function eth_requestAccounts(){
    // 连接到 MetaMask 钱包
    ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        connAccount = accounts[0];
    }).catch((error) => {
        if (error.code === 4001) {
            alert('请连接 MetaMask');
        } else {
            console.error(error);
        }
    });
}

ethereum.on('accountsChanged', onAccountsChanged);

function onAccountsChanged(accounts){
    connAccount = accounts[0];
}

function projectStatus(status){
    if (1 == status){
        return '未开始';
    }
    if (2 == status){
        return '投票中';
    }
    if (3 == status){
        return '投票结束';
    }
}

function getQueryVariable (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
    }
 }