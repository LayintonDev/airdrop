# Merkle Tree-Based Airdrop


---



This repository provides a smart contract implementation for a Merkle-based airdrop, along with JavaScript scripts for generating and verifying Merkle proofs. The airdrop mechanism uses Merkle proofs to ensure that only eligible addresses can claim tokens.

>> Note: All addresses used in this implementation are derived from the Hardhat test suite. You can refer to the script for creating these addresses within your Hardhat environment.

## Table of Contents
- [Setup and Installation](#setup-and-installation)
- [Deploying the MerkleAirdrop Contract](#deploying-the-merkleairdrop-contract)
- [Generating Merkle Trees and Proofs](#generating-merkle-trees-and-proofs)
- [Claiming the Airdrop](#claiming-the-airdrop)
- [Assumptions and Limitations](#assumptions-and-limitations)

## Setup and Installation

### Prerequisites

Make sure you have the following installed:
- Node.js
- Hardhat

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/LayintonDev/airdrop.git
    cd airdrop

    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Deploying the LayiAirDrop Contract

1. **Compile the contracts:**
    ```bash
    npx hardhat compile
    ```

2. **Deploy the contracts:**

    Deploy the `LayiAirDrop` contract using the deployment script. Ensure your Hardhat network configuration is set up:
    ```bash
    npx hardhat run scripts/deploy.ts --network <network-name>
    ```

3. **Contract Details:**
    - **LayiAirDrop Contract:** This contract manages the airdrop process, including verifying proofs and distributing tokens.

## Generating Merkle Trees and Proofs

### Generating the Merkle Tree

1. **Create the Merkle Tree:**
    Use the `generateMerkletrees.ts` script to create a Merkle tree from a predefined set of addresses and token amounts. Modify this script as needed for your use case.

    ```bash
    node generateMerkletrees.ts
    ```

    This will create a `tree.json` file in the root directory containing the Merkle tree data.

### Generating Merkle Proofs

1. **Create Merkle Proofs:**
    The `generateMerkleproof.ts` script is used to generate Merkle proofs for specific addresses in our case "0x90F79bf6EB2c4f870365E785982E1f101E93b906". You can modify the script to generate proofs for other addresses.

    ```bash
    node generateMerkleproof.ts
    ```

    The proof for the specified address will be output to the console.

## Claiming the Airdrop

1. **Fund the Contract:**
   Before users can claim their airdrop, you need to transfer the tokens to the `LayiAirDrop` contract.

2. **Claim Tokens:**
    Users can claim their tokens by calling the `claimAirDrop` function on the `LayiAirDrop` contract with their Merkle proof, index, and amount. 

    Example of claiming tokens in your test file:
    ```js
    const proof = [
        "0x9c2c52f8fdbb115f3f498d9eff09e9541c59355a9244f8777b737cd771e34881",
        "0xf9828ab50922dcbcce049075b73b72e405313c393fdfb6cd74b5f70cd13065f3",
        "0x933ac483017681af59876edce64112e940769889496b034ad7d05dd2a0deb8ca",
    ];
    await merkleDrop.claimAirDrop(proof, 1, ethers.parseUnits("20", 18));
    ```

## Assumptions and Limitations

- **Decimal Handling:** The implementation assumes that the decimals for token amounts are handled externally and that the `amount` parameter passed to the `claimAirDrop` function is already formatted correctly.
  
- **Tree and Proof Generation:** The scripts provided (`generateMerkletrees.ts` and `generateMerkleproof.ts`) generate trees and proofs based on predefined values. You should modify the values to suit your airdrop requirements.

- **Preimage Attack Protection:** The `_verifyProof` function in the `LayiAirdrop` contract double-hashes the data to prevent second preimage attacks.


## Running Tests

To run the tests, use:
```bash
npx hardhat test
```

