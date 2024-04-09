// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract UserAccountData is Ownable {
    struct Account {
        uint256 collateralBalance;
        uint256 borrowedAmount;
        uint256 tokenBalance;
        uint256 usdcBalance;
        uint256 interestIndex;
        bool isActive;
    }

    struct Transaction {
        address user;
        uint256 amount;
        uint256 timestamp;
        string tokenName;
        string transactionType;
    }



    PAPCoin public token;

    mapping(address => Account) public accounts;
    mapping(address => Transaction[]) public transactions;

    constructor(address _token)  Ownable(msg.sender) {
        token = PAPCoin(_token);
    }

   function registerUser(address user) public {
    require(accounts[user].isActive == false, "User already registered");
    
    Account memory newUser;
    newUser.collateralBalance = 0;
    newUser.borrowedAmount = 0;
    newUser.tokenBalance =  1000 * 10** token.decimals();
    newUser.usdcBalance = 0;
    newUser.interestIndex = 0;
    newUser.isActive = true;
    
    accounts[user] = newUser;


    addTransaction(msg.sender, 1000 * 10** token.decimals(), "PAPCoin", "Register");

    token.mint(user, 1000 * 10** token.decimals());
    }

    function addTransaction(address user, uint256 amount,  string memory tokenName, string memory transactionType) public {
        Transaction memory newTransaction = Transaction({
            user: user,
            amount: amount,
            timestamp: block.timestamp,
            tokenName: tokenName,
            transactionType: transactionType
        });

        transactions[user].push(newTransaction);
    }

     function updateAccount(address user, uint256 collateralBalance, uint256 borrowedAmount, uint256 tokenBalance, uint256 usdcBalance, uint256 interestIndex, bool isActive) public {
        Account storage account = accounts[user];
        account.collateralBalance = collateralBalance;
        account.borrowedAmount = borrowedAmount;
        account.tokenBalance = tokenBalance;
        account.usdcBalance = usdcBalance;
        account.interestIndex = interestIndex;
        account.isActive = isActive;
    }

    function getTransactions(address user) external view returns (Transaction[] memory) {
        return transactions[user];
    }


    
    function getAccount(address account) external view returns (Account memory) {
        return accounts[account];
    }

    function activateUser(address user) external onlyOwner {
        accounts[user].isActive = true;
    }

    function deactivateUser(address user) external onlyOwner {
        accounts[user].isActive = false;
    }
}
