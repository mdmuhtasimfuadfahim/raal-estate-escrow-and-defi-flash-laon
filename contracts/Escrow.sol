// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public inspector;
    address public lender;

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can make earnest deposit");
        _;
    }

    modifier onlyInspector () {
        require(msg.sender == inspector, "Only inspector can do inspection");
        _;
    }

    bool public inspectionPassed = false;
    mapping(address => bool) public approval;

    receive() external payable {}

    constructor (
        address _nftAddress,
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _inspector,
        address payable _lender
        ) {
            nftAddress = _nftAddress;
            nftID = _nftID;
            purchasePrice = _purchasePrice;
            escrowAmount = _escrowAmount;
            seller = _seller;
            buyer = _buyer;
            inspector = _inspector;
            lender = _lender;
            }

    function depositEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount, "Escrow amount doesn't match");
    }

    function updateInspectionStatus(bool _passed) public onlyInspector {
        inspectionPassed = _passed;
    }

    function approveSale() public {
        approval[msg.sender] = true;
    }

    function getBalance() public view returns (uint) {
        // this is literall referring the smart contract and takes it and convert into address and the balances in solidity
        return address(this).balance;
    }

    function finalizeSale() public {
      require(inspectionPassed, "Inspection must be done before sale");
      require(approval[buyer], "Buyer must give the approval first");
      require(approval[seller], "Seller must give the approval first");
      require(approval[lender], "Lender must give the approval first");
      require(address(this).balance >= purchasePrice, "Must have enough ether for sale");

      (bool success, ) = payable(seller).call{value: address(this).balance}("");
      require(success, "Transfer funds must be done before sale");
      // Transfer ownership of property
      IERC721(nftAddress).transferFrom(seller, buyer, nftID);
    }

    function cancelSale() public {
        if (inspectionPassed == false) {
            payable(buyer).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }
}