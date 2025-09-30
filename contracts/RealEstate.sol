
// pragma solidity ^0.8.0;

// contract DubaiRealEstateMarket {
//     address public dlrAdmin;
    
//     enum ListingStatus { Pending, Active, Sold }
//     enum BidStatus { Pending, Accepted, Rejected }

//     struct Property {
//         string propertyId;
//         address owner;
//         uint256 price;
//         string location;
//         ListingStatus status;
//         address [] bidsHistroy;
//         bool isActive;
//         address[] ownershipHistory;
//     }

//     struct Bid {
//         address bidder;
//         string propertyId;
//         uint256 amount;
//         BidStatus status;
//         uint256 timestamp;
//     }

//     // State variables
//     mapping(string => Property) public properties;
//     mapping(string => Bid[]) public propertyBids;
//     string[] public propertyIds;
//     uint256 public totalProperties;

//     // Events
//     event PropertyListed(string propertyId, address owner);
//     event OwnershipTransferred(string propertyId, address previousOwner, address newOwner);
//     event PropertyActivated(string propertyId);
//     event BidAccepted(string propertyId, address newOwner);

//     modifier onlyDLRAdmin() {
//         require(msg.sender == dlrAdmin, "Only DLR admin");
//         _;
//     }

//     modifier onlyActiveListing(string memory _propertyId) {
//         require(properties[_propertyId].isActive, "Listing not active");
//         _;
//     }

//     constructor() {
//         dlrAdmin = msg.sender;
//     }

//     // Seller lists property
//     function listProperty(
//         string memory _propertyId,
//         uint256 _price,
//         string memory _location
//     ) external {
//         require(properties[_propertyId].owner == address(0), "Property exists");
        
//         properties[_propertyId] = Property({
//             propertyId: _propertyId,
//             owner: msg.sender,
//             price: _price,
//             location: _location,
//             status: ListingStatus.Pending,
//             isActive: false,
//             ownershipHistory: new address[](0)
//         });
        
//         properties[_propertyId].ownershipHistory.push(msg.sender);
//         propertyIds.push(_propertyId);
//         totalProperties++;
//         emit PropertyListed(_propertyId, msg.sender);
//     }

//     // DLR activates listing
//     function activateListing(string memory _propertyId) external onlyDLRAdmin {
//         properties[_propertyId].isActive = true;
//         properties[_propertyId].status = ListingStatus.Active;
//         emit PropertyActivated(_propertyId);
//     }

//     // Buyer places bid
//     function placeBid(string memory _propertyId) external payable onlyActiveListing(_propertyId) {
//         require(msg.value > 0, "Bid amount > 0");
        
//         propertyBids[_propertyId].push(Bid({
//             bidder: msg.sender,
//             amount: msg.value,
//             status: BidStatus.Pending,
//             timestamp: block.timestamp
//         }));
//     }

//     // Seller accepts bid
//     function acceptBid(string memory _propertyId, uint256 bidIndex) external {
//         require(properties[_propertyId].owner == msg.sender, "Not owner");
//         Bid storage bid = propertyBids[_propertyId][bidIndex];
        
//         address previousOwner = properties[_propertyId].owner;
//         address newOwner = bid.bidder;

//         // Transfer ownership
//         properties[_propertyId].owner = newOwner;
//         properties[_propertyId].status = ListingStatus.Sold;
//         properties[_propertyId].isActive = false;
//         properties[_propertyId].ownershipHistory.push(newOwner);

//         // Transfer funds
//         payable(msg.sender).transfer(bid.amount);
//         bid.status = BidStatus.Accepted;

//         emit OwnershipTransferred(_propertyId, previousOwner, newOwner);
//         emit BidAccepted(_propertyId, newOwner);
//     }

//     // Get all property IDs
//     function getAllPropertyIds() public view returns (bytes32[] memory) {
//         bytes32[] memory ids = new bytes32[](propertyIds.length);
//         for (uint i = 0; i < propertyIds.length; i++) {
//             ids[i] = stringToBytes32(propertyIds[i]);
//         }
//         return ids;
//     }
//     function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
//         bytes memory tempEmptyStringTest = bytes(source);
//         if (tempEmptyStringTest.length == 0) {
//             return 0x0;
//         }
//         // Assumes string is at most 32 bytes
//         assembly {
//             result := mload(add(source, 32))
//         }
//     }

//     // Get paginated properties
//     function getPaginatedProperties(uint256 start, uint256 end) public view 
//         returns (Property[] memory) 
//     {
//         require(start < end && end <= propertyIds.length, "Invalid range");
//         Property[] memory result = new Property[](end - start);
//         for(uint256 i = start; i < end; i++) {
//             result[i - start] = properties[propertyIds[i]];
//         }
//         return result;
//     }

//     // Get property details
//     function getPropertyDetails(string memory _propertyId) public view returns (
//         string memory id,
//         address owner,
//         uint256 price,
//         string memory location,
//         ListingStatus status,
//         bool isActive,
//         address[] memory history
//     ) {
//         Property storage p = properties[_propertyId];
//         return (
//             p.propertyId,
//             p.owner,
//             p.price,
//             p.location,
//             p.status,
//             p.isActive,
//             p.ownershipHistory
//         );
//     }

//     // Get bids for property
//     function getBids(string memory _propertyId) public view returns (
//         string memory propertyId,
//         Bid[] memory bids
//     ) {
//         return (_propertyId, propertyBids[_propertyId]);
//     }

//     // Get ownership history
//     function getOwnershipHistory(string memory _propertyId) public view 
//         returns (address[] memory) 
//     {
//         return properties[_propertyId].ownershipHistory;
//     }
// }



// pragma solidity ^0.8.0;

// contract DubaiRealEstateMarket {
//     address public dlrAdmin;
    
//     enum ListingStatus { Pending, Active, Sold }
//     enum BidStatus { Pending, Accepted, Rejected }

//     struct Property {
//         string propertyId;
//         address owner;
//         uint256 price;
//         string location;
//         ListingStatus status;
//         bool isActive;
//         address[] ownershipHistory;
//         Bid[] bids; // Directly store bids in Property struct
//     }

//     struct Bid {
//         address bidder;
//         uint256 amount;
//         BidStatus status;
//         uint256 timestamp;
//     }

//     // State variables
//     mapping(string => Property) public properties;
//     string[] public propertyIds;
//     uint256 public totalProperties;

//     // Events
//     event PropertyListed(string propertyId, address owner);
//     event OwnershipTransferred(string propertyId, address previousOwner, address newOwner);
//     event PropertyActivated(string propertyId);
//     event BidPlaced(string propertyId, address bidder);
//     event BidAccepted(string propertyId, address newOwner);

//     modifier onlyDLRAdmin() {
//         require(msg.sender == dlrAdmin, "Only DLR admin");
//         _;
//     }

//     modifier onlyActiveListing(string memory _propertyId) {
//         require(properties[_propertyId].isActive, "Listing not active");
//         _;
//     }

//     constructor() {
//         dlrAdmin = msg.sender;
//     }

//     // Seller lists property
//     function listProperty(
//         string memory _propertyId,
//         uint256 _price,
//         string memory _location
//     ) external {
//         require(properties[_propertyId].owner == address(0), "Property exists");
        
//         properties[_propertyId] = Property({
//             propertyId: _propertyId,
//             owner: msg.sender,
//             price: _price,
//             location: _location,
//             status: ListingStatus.Pending,
//             isActive: false,
//             ownershipHistory: new address[](0),
//             bids: new Bid[](0)
//         });
        
//         properties[_propertyId].ownershipHistory.push(msg.sender);
//         propertyIds.push(_propertyId);
//         totalProperties++;
//         emit PropertyListed(_propertyId, msg.sender);
//     }

//     // DLR activates listing
//     function activateListing(string memory _propertyId) external onlyDLRAdmin {
//         properties[_propertyId].isActive = true;
//         properties[_propertyId].status = ListingStatus.Active;
//         emit PropertyActivated(_propertyId);
//     }

//     // Buyer places bid
//     function placeBid(string memory _propertyId) external payable onlyActiveListing(_propertyId) {
//         require(msg.value > 0, "Bid amount > 0");
        
//         properties[_propertyId].bids.push(Bid({
//             bidder: msg.sender,
//             amount: msg.value,
//             status: BidStatus.Pending,
//             timestamp: block.timestamp
//         }));
        
//         emit BidPlaced(_propertyId, msg.sender);
//     }

//     // Seller accepts bid
//     function acceptBid(string memory _propertyId, uint256 bidIndex) external {
//         require(properties[_propertyId].owner == msg.sender, "Not owner");
//         Bid storage bid = properties[_propertyId].bids[bidIndex];
        
//         address previousOwner = properties[_propertyId].owner;
//         address newOwner = bid.bidder;

//         // Transfer ownership
//         properties[_propertyId].owner = newOwner;
//         properties[_propertyId].status = ListingStatus.Sold;
//         properties[_propertyId].isActive = false;
//         properties[_propertyId].ownershipHistory.push(newOwner);
//         bid.status = BidStatus.Accepted;

//         // Transfer funds
//         payable(msg.sender).transfer(bid.amount);

//         emit OwnershipTransferred(_propertyId, previousOwner, newOwner);
//         emit BidAccepted(_propertyId, newOwner);
//     }

//     // Get all property IDs
//     function getAllPropertyIds() public view returns (string[] memory) {
//         return propertyIds;
//     }

//     // Get active listings
//     function getActiveListings() public view returns (Property[] memory) {
//         Property[] memory active = new Property[](propertyIds.length);
//         uint256 count = 0;
        
//         for(uint256 i = 0; i < propertyIds.length; i++) {
//             if(properties[propertyIds[i]].isActive) {
//                 active[count] = properties[propertyIds[i]];
//                 count++;
//             }
//         }
        
//         // Resize array to actual active count
//         Property[] memory result = new Property[](count);
//         for(uint256 i = 0; i < count; i++) {
//             result[i] = active[i];
//         }
        
//         return result;
//     }

//     // Get property details
//     function getPropertyDetails(string memory _propertyId) public view returns (
//         string memory id,
//         address owner,
//         uint256 price,
//         string memory location,
//         ListingStatus status,
//         bool isActive,
//         address[] memory history,
//         Bid[] memory bids
//     ) {
//         Property storage p = properties[_propertyId];
//         return (
//             p.propertyId,
//             p.owner,
//             p.price,
//             p.location,
//             p.status,
//             p.isActive,
//             p.ownershipHistory,
//             p.bids
//         );
//     }
// }


// pragma solidity ^0.8.13; // Update from 0.8.0 to 0.8.21

// contract DubaiRealEstateMarket {
//     address public dlrAdmin;
    
//     enum ListingStatus { Pending, Active, Sold }
//     enum BidStatus { Pending, Accepted, Rejected }

//     struct Property {
//         string propertyId;
//         address owner;
//         uint256 price;
//         string location;
//         ListingStatus status;
//         bool isActive;
//         address[] ownershipHistory;
//     }

//     struct Bid {
//         address bidder;
//         uint256 amount;
//         BidStatus status;
//         uint256 timestamp;
//     }

//     mapping(string => Property) public properties;
//     mapping(string => Bid[]) public propertyBids; // Separate mapping for bids
//     string[] public propertyIds;

//     event PropertyListed(string propertyId, uint256 price, string location, address owner);
//     event OwnershipTransferred(string propertyId, address previousOwner, address newOwner);
//     event PropertyActivated(string propertyId);
//     event BidPlaced(string propertyId, address bidder);
//     event BidAccepted(string propertyId, address newOwner);

//     constructor() {
//         dlrAdmin = msg.sender;
//     }

//     function listProperty(
//         string calldata _propertyId,
//         uint256 _price,
//         string calldata _location
//     ) external {
//         require(properties[_propertyId].owner == address(0), "Property exists");
        
//         properties[_propertyId] = Property({
//             propertyId: _propertyId,
//             owner: msg.sender,
//             price: _price,
//             location: _location,
//             status: ListingStatus.Pending,
//             isActive: false,
//             ownershipHistory: new address[](0)
//         });
        
//         properties[_propertyId].ownershipHistory.push(msg.sender);
//         propertyIds.push(_propertyId);
//         emit PropertyListed(_propertyId,_price,_location, msg.sender);
//     }

// function activateListing(string calldata _propertyId) external {
//     require(msg.sender == dlrAdmin, "Only DLR admin"); // Changed from "Only admin"
//     properties[_propertyId].isActive = true;
//     properties[_propertyId].status = ListingStatus.Active;
//     emit PropertyActivated(_propertyId);
// }

//     function placeBid(string calldata _propertyId) external payable {
//         require(properties[_propertyId].isActive, "Listing inactive");
//         require(msg.value > 0, "Bid amount > 0");
        
//         propertyBids[_propertyId].push(Bid({
//             bidder: msg.sender,
//             amount: msg.value,
//             status: BidStatus.Pending,
//             timestamp: block.timestamp
//         }));
//         emit BidPlaced(_propertyId, msg.sender);
//     }

//     function acceptBid(string calldata _propertyId, uint256 bidIndex) external {
//         require(properties[_propertyId].owner == msg.sender, "Not owner");
//         Bid storage bid = propertyBids[_propertyId][bidIndex];
        
//         address previousOwner = msg.sender;
//         address newOwner = bid.bidder;

//         properties[_propertyId].owner = newOwner;
//         properties[_propertyId].status = ListingStatus.Sold;
//         properties[_propertyId].isActive = false;
//         properties[_propertyId].ownershipHistory.push(newOwner);
//         bid.status = BidStatus.Accepted;
        
//         payable(msg.sender).transfer(bid.amount);
//         emit OwnershipTransferred(_propertyId, previousOwner, newOwner);
//         emit BidAccepted(_propertyId, newOwner);
//     }

//     // Additional helper functions
//     function getBids(string calldata _propertyId) public view returns (Bid[] memory) {
//         return propertyBids[_propertyId];
//     }
//     function getOwnershipHistory(string calldata _propertyId) public view returns (address[] memory) {
//         return properties[_propertyId].ownershipHistory;
//     }

//     function getAllPropertyIds() public view returns (string[] memory) {
//         return propertyIds;
//     }
// }



// SPDX-License-Identifier: MIT

// Contract need to be compiled and deployed again Changes made in the contract
// price being emitted in the event PropertyListed
pragma solidity ^0.8.13;

contract DubaiRealEstateMarket {
    address public dlrOwner; // Just as contract owner (optional for future use)

    struct Property {
        string propertyId;
        address owner;
        uint256 price;
        string location;
        bool isActive;
        address[] ownershipHistory;
    }

    mapping(string => Property) public properties;
    string[] public propertyIds;

    // Events
    event PropertyListed(string propertyId, uint256 price, string location, address indexed owner);
    event OwnershipTransferred(string propertyId, uint256 price, address indexed previousOwner, address indexed newOwner);
    event PropertyActivated(string propertyId);
    event PropertyDeactivated(string propertyId);
    event PropertySold(string propertyId, address indexed newOwner);
    event PriceUpdated(string _propertyId, uint256 _newPrice);


    constructor() {
        dlrOwner = msg.sender;
    }

    // Function to list a new property
    function listProperty(
        string calldata _propertyId,
        uint256 _price,
        string calldata _location
    ) external {
        require(properties[_propertyId].owner == address(0), "Property already exists");

        properties[_propertyId] = Property({
            propertyId: _propertyId,
            owner: msg.sender,
            price: _price,
            location: _location,
            isActive: false,
            ownershipHistory: new address[](0)
            });

        properties[_propertyId].ownershipHistory.push(msg.sender);
        propertyIds.push(_propertyId);

        emit PropertyListed(_propertyId, _price, _location, msg.sender);
    }

    // Function to activate listing by the property owner
   function activateListing(string calldata _propertyId) external {
    if (properties[_propertyId].owner != msg.sender) 
        revert("Only owner can activate listing");
    if (properties[_propertyId].isActive) 
        revert("Property already active");
    
    properties[_propertyId].isActive = true;
    emit PropertyActivated(_propertyId);
}

    // Function to deactivate listing by the property owner
    function deactivateListing(string calldata _propertyId) external {
        require(properties[_propertyId].owner == msg.sender, "Only owner can deactivate listing");
        require(properties[_propertyId].isActive, "Already inactive");

        properties[_propertyId].isActive = false;
        emit PropertyDeactivated(_propertyId);
    }

    // Direct purchase function - buyer can buy directly
function buyProperty(string calldata _propertyId) external payable {
    Property storage property = properties[_propertyId];

    if (property.owner == address(0))
        revert("Property does not exist");
    if (!property.isActive)
        revert("Property is not active");
    if (msg.sender == property.owner)
        revert("Owner cannot buy their own property");
    if (msg.value != property.price)
        revert("Incorrect payment amount");

    address previousOwner = property.owner;
    property.price = msg.value;
    property.owner = msg.sender;
    property.isActive = false; // Mark as sold
    property.ownershipHistory.push(msg.sender);

    payable(previousOwner).transfer(msg.value); // Transfer amount to the seller

    emit OwnershipTransferred(_propertyId, property.price, previousOwner, msg.sender);
}


 function updatePropertyPrice(
    string calldata _propertyId, 
    uint256 _newPrice
) external {
    Property storage property = properties[_propertyId];
    
    if (property.owner == address(0)) 
        revert("Property does not exist");
    if (msg.sender != property.owner) 
        revert("Only owner can update price");
    
    property.price = _newPrice;
    emit PriceUpdated(_propertyId, _newPrice);
}
        
    // View all property IDs
    function getAllPropertyIds() public view returns (string[] memory) {
        return propertyIds;
    }

    // View ownership history of a property
    function getOwnershipHistory(string calldata _propertyId) public view returns (address[] memory) {
        return properties[_propertyId].ownershipHistory;
    }

    // View a property by ID
    function getProperty(string calldata _propertyId) public view returns (
        string memory,
        address,
        uint256,
        string memory,
        bool,
        address[] memory
    ) {
        Property memory p = properties[_propertyId];
        return (
            p.propertyId,
            p.owner,
            p.price,
            p.location,
            p.isActive,
            p.ownershipHistory
        );
    }
}
