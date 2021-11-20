// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract Hacka is Ownable {
    uint private s_counter = 0;
    LinkTokenInterface internal LinkToken;

    enum HackathonStage { NEW, STARTED, JUDGING, FINALIZED }

    struct HackathonMetadata {
        address organizer;
        uint timestampStart;
        uint timestampEnd;
        uint8 judgingPeriod;
        HackathonStage stage;
        string name;
        string url;
        uint balance;
        // TODO cid for description
    }

    struct HackathonPrize {
        uint reward;
        address[] judges;
        string name;
        string description;
        address[] submissions;
        address winner;
    }

    mapping(uint => HackathonMetadata) public s_hackathons;
    mapping(uint => HackathonPrize[]) public s_prizes;
    mapping(address => uint[]) public s_organizerHackathons;

    event HackathonCreated(uint indexed hackathonId, address indexed organizer, string name, string url, uint timestampStart);
    event HackathonChanged(uint indexed hackathonId, string name, string url, uint timestampStart);

    /**
     * @notice Deploy with the address of the LINK token
     * @notice @param _link The address of the LINK token
     */
    constructor(/*address _link*/) {
        // LinkToken = LinkTokenInterface(_link);
        // TODO should not be hardcoded
        // TODO add hackathon ERC20 as well?
        LinkToken = LinkTokenInterface(0xa36085F69e2889c224210F603D836748e7dC0088);
    }

    function createHackathon(
        uint _timestampStart,
        uint _timestampEnd,
        string calldata _name,
        string calldata _url,
        uint8 _judgingPeriod
    ) external returns (uint hackathonId) {
        validateMetadata(
            _timestampStart,
            _timestampEnd,
            _name,
            _judgingPeriod,
            block.timestamp
        );

        hackathonId = s_counter;
        s_counter = s_counter + 1;

        s_hackathons[hackathonId].organizer = msg.sender;
        s_hackathons[hackathonId].timestampStart = _timestampStart;
        s_hackathons[hackathonId].timestampEnd = _timestampEnd;
        s_hackathons[hackathonId].judgingPeriod = _judgingPeriod;
        s_hackathons[hackathonId].stage = HackathonStage.NEW;
        s_hackathons[hackathonId].name = _name;
        s_hackathons[hackathonId].url = _url;

        s_organizerHackathons[msg.sender].push(hackathonId);

        emit HackathonCreated(hackathonId, msg.sender, _name, _url, _timestampStart);

        return hackathonId;
    }

    function updateHackathonMetadata(
        uint _hackathonId,
        uint _timestampStart,
        uint _timestampEnd,
        string calldata _name,
        string calldata _url,
        uint8 _judgingPeriod
    ) external {
        require(s_hackathons[_hackathonId].organizer == msg.sender, "Only hackathon's organizer can change its metadata");
        require(s_hackathons[_hackathonId].timestampStart - block.timestamp > 1 hours, "Hackathon metadata can be changed up until 1 hour before start");
        require(s_hackathons[_hackathonId].stage == HackathonStage.NEW, "Hackathon metadata can't change after it has started");
        validateMetadata(
            _timestampStart,
            _timestampEnd,
            _name,
            _judgingPeriod,
            block.timestamp
        );

        s_hackathons[_hackathonId].timestampStart = _timestampStart;
        s_hackathons[_hackathonId].timestampEnd = _timestampEnd;
        s_hackathons[_hackathonId].name = _name;
        s_hackathons[_hackathonId].url = _url;
        s_hackathons[_hackathonId].judgingPeriod = _judgingPeriod;

        emit HackathonChanged(_hackathonId, _name, _url, _timestampStart);
    }

    // TODO method to transfer hackathon ownership to another address (change organizer)

    function validateMetadata(
        uint _timestampStart,
        uint _timestampEnd,
        string calldata _name,
        uint8 _judgingPeriod,
        uint _currentTimestamp
    ) pure internal {
        require(_timestampEnd - _timestampStart > 1 days, "Hackathon must be at least 1 day long");
        require(_timestampStart - _currentTimestamp >= 1 days, "Hackathon start date must be at least 1 day in the future");
        require(_judgingPeriod >= 1, "Judging period must be at least 1 day");
        require(_judgingPeriod <= 31, "Judging period must not be longer than 31 days");
        require(bytes(_name).length >= 8, "Hackathon name must be at least 8 characters");
        require(bytes(_name).length <= 100, "Hackathon name must be at most 100 characters");
    }

    // TODO should use LINK or our own "Hackathon Token" ERC20, for now just use ETH
    function addPrize(
        uint256 _amount,
        uint _hackathonId,
        string calldata _name,
        string calldata _description
    ) external payable returns (uint prizeId) {
        require(msg.value == _amount);
        require(s_hackathons[_hackathonId].stage == HackathonStage.NEW, "Can't add a prize to an ongoing or finished hackathon");
        require(s_hackathons[_hackathonId].organizer == msg.sender, "Only hackathon's organizer can add a prize");
        require(bytes(_name).length > 8, "Prize name must be at least 8 characters");
        require(msg.value > 1 ether, "Minimum prize reward is 1 ETH"); // TODO why so much????

        s_hackathons[_hackathonId].balance += msg.value;

        HackathonPrize memory prize;
        prize.reward = msg.value;
        prize.name = _name;
        prize.description = _description;

        prizeId = s_prizes[_hackathonId].length;
        s_prizes[_hackathonId].push(prize);

        // TODO emit event about prize being created

        return prizeId;
    }

    function addJudge(
        uint _hackathonId,
        uint _prizeId,
        address _judge
    ) external {
        require(s_hackathons[_hackathonId].organizer == msg.sender, "Only hackathon's organizer can add a judge");
        require(s_prizes[_hackathonId][_prizeId].reward > 0, "Prize not found");

        s_prizes[_hackathonId][_prizeId].judges.push(_judge);
        // TODO emit event about judge being added
    }

    function getHackathonsByOrganizer(
        address _organizer
    ) external view returns (uint[] memory) {
        return s_organizerHackathons[_organizer];
    }

    function getHackathonMetadata(uint _hackathonId) external view returns (HackathonMetadata memory) {
        return s_hackathons[_hackathonId];
    }

    function getHackathonPrizes(uint _hackathonId) external view returns (HackathonPrize[] memory) {
        return s_prizes[_hackathonId];
    }

    /**
     * @notice Allows the owner to withdraw any LINK balance on the contract
     */
    function withdrawLink() public onlyOwner {
        require(LinkToken.transfer(msg.sender, LinkToken.balanceOf(address(this))), "Unable to transfer");
    }
}
