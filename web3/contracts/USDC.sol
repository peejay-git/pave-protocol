// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Define ERC20 token
contract PAPUSDC is ERC20, Ownable {
    constructor() ERC20("PAPUSDC", "PUSDC") Ownable(msg.sender) {
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

      function burn(uint256 amount) external onlyOwner() {
        _burn(address(0), amount);
    }

}
