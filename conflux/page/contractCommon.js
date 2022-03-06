const contractAddress = 'cfxtest:acep2s5vx129zkz46gad21pspe4xn6802epg9tz80m';
// const contractAddress = 'cfxtest:accwcrue5edag45drx7fdpkh3z2y5z8x3jwn6acxzx';
var connAccount;
var myContract;
var myWeb3;
var myFormat;
var myDrip;
var jsonInterface;

$(function(){
    // if (typeof window.conflux !== 'undefined'){
    if (conflux.isFluent) {
        requestAccounts();
    }else{
        alert('请先安装 Fluent');
        return;
    }
});

// 读取 jsonInterface
function initMyContract(callback){
    $.getJSON('../data/vote.json', function(res){
        console.log(res);
        jsonInterface = res;
        myFormat = window.TreeGraph.format;
        myDrip = window.TreeGraph.Drip;
        myWeb3 = new window.TreeGraph.Conflux({
            url: "https://portal-test.confluxrpc.com",
            networkId: 1,
            logger: console,
        });
        myWeb3.provider = conflux;
        myContract = myWeb3.Contract({abi:jsonInterface,address:contractAddress});
        if (callback){
            callback();
        }
    })
}

function requestAccounts(){
    // 连接到 Fluent 钱包
    conflux.request({method: "cfx_requestAccounts"}).then(accounts => {
        connAccount = accounts[0];
    }).catch(error => {
        console.error(error);
    });
}

conflux.on('accountsChanged', onAccountsChanged);
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