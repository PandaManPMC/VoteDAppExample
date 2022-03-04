// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract vote{

    address public owner;

    struct voteItem{
        string name;
        uint32 count;
    }

    struct voteProject{
        address initiator;
        string name;
        uint8 status; //1=未开始;2=投票中;3=投票完成
        uint32 count;
        string img;
    }

    // 投票项目列表
    voteProject[] public projectList;
    // 投票选项 projectList.index 作为key
    mapping(uint => voteItem[]) public projectItems;
    // 用户投票关联，已投票选项index = [投票项目index][用户钱包]
    mapping(uint => mapping(address => uint)) public memberVote;
    // 投票记录
    mapping(uint => mapping(address => bool)) public membreVoteRecord;

    constructor(){
        owner = msg.sender;
    }

    /*
    *   @dev 增加投票项目
    *   @params string _name 投票项目名称
    *   @params string imgURI 投票项目图片URI
    *   @params string[] options 投票选项
    */
    function putVoteProject(string memory _name,string memory imgURI,string[] memory options) public {
        uint index = projectList.length;
        projectList.push(voteProject({initiator: msg.sender,name: _name,status:1,count:0,img:imgURI}));
        voteItem[] storage items = projectItems[index];
        for (uint i=0;i<options.length;i++){
            items.push();
            items[i].name = options[i];
            items[i].count = 0;
        }
    }

    function getVoteProjectList() public view returns(voteProject[] memory){
        return projectList;
    }

    function getVoteProjectItem(uint projectIndex) public view returns(voteItem[] memory){
        return projectItems[projectIndex];
    }

    /*
    *   @dev 投票，支付0.1 ETH 才能投票
    *   @params uint projectIndex 投票项目编号
    *   @params uint option 选项编号
    */
    function putVote(uint projectIndex,uint option) external payable {
        require(msg.value == 0.1 ether);
        require(projectIndex < projectList.length);
        require(option < projectItems[projectIndex].length);
        require(projectList[projectIndex].status == 2);
        require(memberVote[projectIndex][msg.sender] == 0);
        projectList[projectIndex].count +=1;
        projectItems[projectIndex][option].count += 1;
        memberVote[projectIndex][msg.sender] = option;
        membreVoteRecord[projectIndex][msg.sender] = true;
    }

    /*
    *   @dev 开始投票
    *   @params uint projectIndex 投票项目编号
    */
    function startVote(uint projectIndex) public {
        // 只有投票发起者才有权限决定开启投票
        require(msg.sender == projectList[projectIndex].initiator);
        projectList[projectIndex].status = 2;
    }

    /*
    *   @dev 停止投票
    *   @params uint projectIndex 投票项目编号
    */
    function stopVote(uint projectIndex) public {
        require(msg.sender == projectList[projectIndex].initiator);
        projectList[projectIndex].status = 3;
    }

    // 转移财产
    function withdraw() external {
        if (msg.sender == owner){
            address payable pay = payable(owner);
            pay.transfer(payable(this).balance);
        }
    }

    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}