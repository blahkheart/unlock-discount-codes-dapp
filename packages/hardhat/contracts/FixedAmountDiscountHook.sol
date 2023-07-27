// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2 <0.9.0;

import "./DiscountHook.sol";

interface IERC20 {
    function decimals() external view returns (uint8);
}

// discount is expressed in fixed dollar amounts (ie $100 is 100)
contract FixedAmountDiscountHook is DiscountHook {
    // mapping of lock address, to address for password to LockNFT address required to enable discount
    mapping(address => mapping ( address => address)) public discountLocks;
    // Array to store stable coin addresses
    address[] stableCoins;

    constructor() {
    }

    function setLockEnabledDiscount(address lock, address signer, address requiredLock) public {
        bool isManager = IPublicLockV12(requiredLock).isLockManager(msg.sender);
        require(isManager, "Not Manager");
        discountLocks[lock][signer] = requiredLock;
    }

    /**
     * Price discount is only applied if recipient has the required NFT... 
     * but we fail if signer of data does not match the lock's password.
     */
    function keyPurchasePrice(
        address, /* from */
        address recipient,
        address, /* referrer */
        bytes calldata signature /* data */
    ) external view override  returns (uint256 minKeyPrice) {
        uint keyPrice = IPublicLockV12(msg.sender).keyPrice();
        address signer = getSigner(toString(recipient), signature);
        address _discountLock = discountLocks[msg.sender][signer];
        uint discount = discounts[msg.sender][signer];
        uint discountAmount = _getDiscountAmount(msg.sender, discount);
        if (discount > 0) {
            if(_discountLock != address(0)){
                bool hasKey = IPublicLockV12(_discountLock).getHasValidKey(recipient);
                if(hasKey){ 
                    return (keyPrice - discountAmount);
                }else {
                    return keyPrice;
                }
            }
            return (keyPrice - discountAmount);
        }
        return keyPrice;
    }

    // Add new stable coins
    function addStableCoin(address coinAddress) external onlyOwner {
        stableCoins.push(coinAddress);
    }

    // Function to remove a stable coin address from the array
    function removeStableCoin(address coinAddress) external onlyOwner {
        for (uint256 i = 0; i < stableCoins.length; i++) {
            if (stableCoins[i] == coinAddress) {
                // Remove the coinAddress from the array
                stableCoins[i] = stableCoins[stableCoins.length - 1];
                stableCoins.pop();
                break;
            }
        }
    }

    function getStableCoins() public view returns(address[] memory){
        return stableCoins;
    } 

    function _getDiscountAmount(address _lock, uint256 _discount) private view returns (uint256) {
        // Fetch the 'tokenAddress' from the Unlock NFT contract
        address tokenAddress = IPublicLockV12(_lock).tokenAddress();
        // Check if 'tokenAddress' matches any stable coin address
        address stableCoinAddress;
        for (uint256 i = 0; i < stableCoins.length; i++) {
            if (stableCoins[i] == tokenAddress) {
                stableCoinAddress = stableCoins[i];
                break;
            }
        }
        require(stableCoinAddress != address(0), "Stablecoin not found");
        uint8 tokenDecimals = IERC20(stableCoinAddress).decimals();
        // Calculate and return the discount amount in token units
        return _discount * (10**uint256(tokenDecimals));
    }

}