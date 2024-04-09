// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./UserAccountData.sol"; 
import "./Token.sol";
import "./USDC.sol";

contract LendingPool is Ownable {
    PAPCoin public token;
    PAPUSDC public usdc;
    UserAccountData public userAccountDataContract;
    uint256 public interestRate = 20;
   

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event InterestRateChanged(uint256 newRate);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);

    constructor(address _token, address _usdc, address _userAccountDataContract)  Ownable(msg.sender) {
        token = PAPCoin(_token);
        usdc = PAPUSDC(_usdc);
        userAccountDataContract = UserAccountData(_userAccountDataContract);
        // interestRate = _interestRate;
    }


    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        
        UserAccountData.Account memory account = userAccountDataContract.getAccount(msg.sender);
        require(account.tokenBalance >= amount, "Insufficient token balance");
        
        uint collateralBalance =  account.collateralBalance + amount;
        uint tokenBalance = account.tokenBalance - amount;
        uint borrowedAmount = account.borrowedAmount;
        uint usdcBalance = account.usdcBalance;
        uint interestIndex = account.interestIndex;
        bool isActive = account.isActive;

        userAccountDataContract.updateAccount(msg.sender, collateralBalance, borrowedAmount, tokenBalance, usdcBalance, interestIndex, isActive);



        userAccountDataContract.addTransaction(msg.sender, amount, "PAPCoin", "Deposit");

        token.transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
         UserAccountData.Account memory account = userAccountDataContract.getAccount(msg.sender);
        uint256 remainder = token.balanceOf(msg.sender) - amount;
        require(account.tokenBalance >= amount, "Insufficient balance");
        require(account.collateralBalance >= amount, "Insufficient token balance");
        require(remainder >= account.collateralBalance, "Collaterral in use balance");
       

        uint collateralBalance =  account.collateralBalance - amount;
        uint tokenBalance = account.tokenBalance + amount;
        uint borrowedAmount = account.borrowedAmount;
        uint usdcBalance = account.usdcBalance;
        uint interestIndex = account.interestIndex;
        bool isActive = account.isActive;

        userAccountDataContract.updateAccount(msg.sender, collateralBalance, borrowedAmount, tokenBalance, usdcBalance, interestIndex, isActive);


        userAccountDataContract.addTransaction(msg.sender, amount, "PAPCoin", "Withdrawal");

        token.transfer(msg.sender, amount);
        emit Withdrawal(msg.sender, amount);
    }

    function borrow(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        UserAccountData.Account memory account = userAccountDataContract.getAccount(msg.sender);
        require(account.collateralBalance >= amount, "Insufficient collateral");

        uint collateralBalance =  account.collateralBalance;
        uint tokenBalance = account.tokenBalance;
        uint borrowedAmount = account.borrowedAmount + amount;
        uint usdcBalance = account.usdcBalance + amount;
        uint interestIndex = account.interestIndex;
        bool isActive = account.isActive;

        userAccountDataContract.updateAccount(msg.sender, collateralBalance, borrowedAmount, tokenBalance, usdcBalance, interestIndex, isActive);

        userAccountDataContract.addTransaction(msg.sender, amount, "PAPUSDC", "Borrow");


        usdc.mint(msg.sender, amount);
        emit Borrow(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
         UserAccountData.Account memory account = userAccountDataContract.getAccount(msg.sender);
        require(account.borrowedAmount >= amount, "Insufficient balance");
        require(account.usdcBalance >= amount, "Insufficient balance");
        require(usdc.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

         uint collateralBalance =  account.collateralBalance;
        uint tokenBalance = account.tokenBalance;
        uint borrowedAmount = account.borrowedAmount - amount;
        uint usdcBalance = account.usdcBalance - amount;
        uint interestIndex = account.interestIndex;
        bool isActive = account.isActive;

        userAccountDataContract.updateAccount(msg.sender, collateralBalance, borrowedAmount, tokenBalance, usdcBalance, interestIndex, isActive);

        userAccountDataContract.addTransaction(msg.sender, amount, "PAPUSDC", "Repay");


        usdc.transferFrom(msg.sender, address(this), amount);
        emit Repay(msg.sender, amount);

    }

    function repayWithCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
         UserAccountData.Account memory account = userAccountDataContract.getAccount(msg.sender);
        require(account.collateralBalance >= amount, "Insufficient collateral");
        require(account.borrowedAmount >= amount, "Insufficient balance");
        uint collateralBalance =  account.collateralBalance - amount;
        uint tokenBalance = account.tokenBalance;
        uint borrowedAmount = account.borrowedAmount -amount;
        uint usdcBalance = account.usdcBalance;
        uint interestIndex = account.interestIndex;
        bool isActive = account.isActive;

        userAccountDataContract.updateAccount(msg.sender, collateralBalance, borrowedAmount, tokenBalance, usdcBalance, interestIndex, isActive);

        userAccountDataContract.addTransaction(msg.sender, amount,"PAPCoin", "Repay");

        token.transferFrom(msg.sender, address(this), amount);
        emit Repay(msg.sender, amount);
    }

    function getUser() external view returns (UserAccountData.Account memory) {
          UserAccountData.Account memory account = userAccountDataContract.getAccount(msg.sender);
         return account;
    }

    function getInterestRate() external view returns (uint256) {
        return interestRate;
    }

    function setInterestRate(uint256 _newRate) public onlyOwner {
        interestRate = _newRate;
         emit InterestRateChanged(_newRate);

    }
}
