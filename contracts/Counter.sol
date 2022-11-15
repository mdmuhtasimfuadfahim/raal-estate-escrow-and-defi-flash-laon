// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    uint public count;
    string public name;

    constructor (uint _initialCount, string memory _name) {
        name = _name;
        count = _initialCount;
    }

    modifier countValue() {
        require(count > 0, "Count is 0 now, first increment it then do decrement");
        _;
    }

    function incrementCount() public returns (uint newCount) {
        count ++;
        return count;
    }

    function getCount() public view returns (uint) {
        return count;
    }

    function getName() public view returns (string memory currentName) {
        return name;
    }

    function decrementCount() public countValue returns (uint newCount) {
        count --;
        return count;
    }

    function setName(string memory _newName) public returns (string memory newName) {
        name = _newName;
        return name;
    }
}