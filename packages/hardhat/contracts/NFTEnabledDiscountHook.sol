// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2 <0.9.0;

import "./DiscountHook.sol";

contract NFTEnabledDiscountHook is DiscountHook {
    // mapping of lock address, to address for password to LockNFT address required to enable discount
    mapping(address => mapping ( address => address)) public discountLocks;

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
        if (discount > 0) {
            if(_discountLock != address(0)){
                bool hasKey = IPublicLockV12(_discountLock).getHasValidKey(recipient);
                if(hasKey){ 
                    return keyPrice - (keyPrice * discount) / 10000;
                }else {
                    return keyPrice;
                }
            }
            return keyPrice - (keyPrice * discount) / 10000;
        }
        return keyPrice;
    }

}