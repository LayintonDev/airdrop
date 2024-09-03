// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {BitMaps} from "@openzeppelin/contracts/utils/structs/BitMaps.sol";

error NotOwner();
error AirDropAlreadyClaimed();
error ClaimingTimeAlreadyPassed();
error InvalidProof();
error AirdropIsStillActive();

contract LayiAirDrop {
    address public immutable owner;
    IERC20 public immutable tokenAddress;

    bytes32 public merkleRoot;
    uint256 airdropEndingTime;
    BitMaps.BitMap internal airDropList;

    event ClaimSuccssful(address indexed, uint256);

    constructor(
        address _tokenAddress,
        bytes32 _merkleRoot,
        uint256 _endingTimeInsec
    ) {
        tokenAddress = IERC20(_tokenAddress);

        owner = msg.sender;

        merkleRoot = _merkleRoot;

        airdropEndingTime = block.timestamp + _endingTimeInsec;
    }

    function claimAirDrop(
        bytes32[] calldata proof,
        uint256 index,
        uint256 amount
    ) external {
        if (BitMaps.get(airDropList, index)) {
            revert AirDropAlreadyClaimed();
        }
        if (!canStillClaim()) {
            revert ClaimingTimeAlreadyPassed();
        }

        verifyProof(proof, index, amount, msg.sender);

        BitMaps.setTo(airDropList, index, true);

        tokenAddress.transfer(msg.sender, amount);

        emit ClaimSuccssful(msg.sender, amount);
    }

    function updateMerkleRppt(bytes32 _newMerkleroot) external {
        _onlyOwner();
        merkleRoot = _newMerkleroot;
    }

    function withdrawTOken() external {
        _onlyOwner();
        if (canStillClaim()) {
            revert AirdropIsStillActive();
        }
        uint256 balance = tokenAddress.balanceOf(address(this));

        tokenAddress.transfer(msg.sender, balance);
    }

    function _onlyOwner() private view {
        if (msg.sender != owner) {
            revert NotOwner();
        }
    }

    function verifyProof(
        bytes32[] memory proof,
        uint256 index,
        uint256 amount,
        address addr
    ) private view {
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(addr, index, amount)))
        );

        if (!MerkleProof.verify(proof, merkleRoot, leaf)) {
            revert InvalidProof();
        }
    }

    function canStillClaim() private view returns (bool) {
        if (block.timestamp < airdropEndingTime) {
            return true;
        }
        return false;
    }
}
