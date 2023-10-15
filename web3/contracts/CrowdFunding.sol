// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Donate {
        uint256 id;
        string campaignId;
        address donator;
        uint256 amount;
        string message;
        uint256 createdAt;
    }

    mapping(uint256 => Donate) public donations;

    uint256 public numberOfDonations = 0;

    // donate to a campaign
    function donateToCampaign(
        string memory _campaignId,
        address _owner,
        string memory _message
    ) public payable {
        require(bytes(_campaignId).length > 0, "Campaign ID is required");
        require(_owner != address(0), "Invalid owner address");
        require(msg.value > 0, "Donation amount must be greater than 0");

        uint256 amount = msg.value;
        Donate storage donate = donations[numberOfDonations];

        numberOfDonations++;

        donate.id = numberOfDonations;
        donate.campaignId = _campaignId;
        donate.donator = msg.sender;
        donate.amount = amount;
        donate.message = _message;
        donate.createdAt = block.timestamp;

        // address ownerAddress = address(bytes20(bytes(_owner)));
        (bool sent, ) = payable(_owner).call{value: amount}("");
        require(sent, "Failed to send Ether to campaign owner");
    }

    function getDonators(
        string memory _campaignId
    ) public view returns (Donate[] memory) {
        uint max = 0;

        for (uint i = 0; i < numberOfDonations; i++) {
            if (
                keccak256(bytes(donations[i].campaignId)) ==
                keccak256(bytes(_campaignId))
            ) {
                max++;
            }
        }
        Donate[] memory allDonate = new Donate[](max);

        for (uint i = 0; i < numberOfDonations; i++) {
            Donate storage item = donations[i];

            if (
                keccak256(bytes(item.campaignId)) ==
                keccak256(bytes(_campaignId))
            ) {
                allDonate[max - 1] = item;
            }
        }

        return allDonate;
    }
}
