// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        string content;
        bool isDelete;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        uint256 likeCount;
    }

    struct Comment {
        uint256 campaignId;
        address account;
        string message;
        uint256 commentedAt;
    }

    struct Like {
        uint256 id;
        uint256 campaignId;
        address account;
        bool unLike;
        uint256 likedAt;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Comment) public comments;
    mapping(uint256 => Like) public likes;

    uint256 public numberOfCampaigns = 0;
    uint256 public numberOfComments = 0;
    uint256 public numberOfLikes = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _content,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.content = _content;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.isDelete = false;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function updateCampaign(
        uint256 _id,
        string memory _content,
        string memory _image
    ) public returns (bool) {
        Campaign storage campaign = campaigns[_id];
        campaign.content = _content;
        campaign.image = _image;

        return true;
    }

    function deleteCampaign(uint256 _id) public returns (bool) {
        Campaign storage campaign = campaigns[_id];
        campaign.isDelete = true;

        return true;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    // Comment to a Project
    function createComment(
        uint256 _campaignId,
        address _account,
        string memory _message
    ) public returns (uint256) {
        Comment storage comment = comments[numberOfComments];

        comment.campaignId = _campaignId;
        comment.account = _account;
        comment.message = _message;
        comment.commentedAt = block.timestamp;

        numberOfComments++;

        return numberOfComments - 1;
    }

    // Get comment List By Campaign Id
    function getCommentsByCampaign(
        uint256 _campaignId
    ) public view returns (Comment[] memory) {
        Comment[] memory commentList = new Comment[](numberOfComments);

        for (uint i = 0; i < numberOfComments; i++) {
            Comment storage item = comments[i];

            if (item.campaignId == _campaignId) {
                commentList[i] = item;
            }
        }

        return commentList;
    }

    // Increase 1 like
    function addLike(
        uint256 _campaignId,
        address _account
    ) public returns (uint256) {
        Like storage like = likes[numberOfLikes];

        numberOfLikes++;
        like.id = numberOfLikes;
        like.campaignId = _campaignId;
        like.account = _account;
        like.unLike = false;
        like.likedAt = block.timestamp;

        // +1 like to campaign
        campaigns[_campaignId].likeCount += 1;

        return numberOfLikes - 1;
    }

    // Get like List By Campaign Id
    function getLikesByCampaign(
        uint256 _campaignId
    ) public view returns (Like[] memory) {
        Like[] memory likeList = new Like[](numberOfLikes);

        for (uint i = 0; i < numberOfLikes; i++) {
            Like storage item = likes[i];

            if (item.campaignId == _campaignId) {
                likeList[i] = item;
            }
        }

        return likeList;
    }

    function updateLike(uint256 _id, bool _status) public returns (bool) {
        Like storage like = likes[_id];

        like.unLike = _status;

        if (_status) {
            // -1 like from campaign
            campaigns[like.campaignId].likeCount -= 1;
        } else {
            // +1 like from campaign
            campaigns[like.campaignId].likeCount += 1;
        }

        return true;
    }
}
