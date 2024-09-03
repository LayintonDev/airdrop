# Merkle Tree Based Airdrop


---



This repository contains a smart contract implementation of a Merkle Airdrop and the accompanying JavaScript scripts to generate and verify Merkle proofs. The airdrop allows users to claim tokens using Merkle proofs, which ensures that only eligible addresses can claim the tokens. 

>> Note : every address here is from the hardhat testsuite you can check script to create it in your hardhat enivornment .

## Table of Contents
- [Setup and Installation](#setup-and-installation)
- [Deploying the MerkleAirdrop Contract](#deploying-the-merkleairdrop-contract)
- [Generating Merkle Trees and Proofs](#generating-merkle-trees-and-proofs)
- [Claiming the Airdrop](#claiming-the-airdrop)
- [Assumptions and Limitations](#assumptions-and-limitations)

## Setup and Installation

### Prerequisites

Ensure you have the following installed:
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

    You can deploy the `LayiAirDrop` contract by running the deployment script (make sure to set up your Hardhat network configuration):
    ```bash
    npx hardhat run scripts/deploy.js --network <network-name>
    ```

3. **Contract Details:**
    - **LayiAirDrop Contract:** This contract handles the airdrop logic, including proof verification and token distribution.

## Generating Merkle Trees and Proofs

### Generating the Merkle Tree

1. **Create the Merkle Tree:**
    The `createmerkletrees.js` script generates a Merkle tree from a predefined list of addresses and token amounts.
    Do well to edit the file for your own use

    ```bash
    node createmerkletrees.js
    ```

    This will create a `tree.json` file in the root directory containing the Merkle tree data.

### Generating Merkle Proofs

1. **Create Merkle Proofs:**
    The `createmerkleproof.js` script is used to generate Merkle proofs for specific addresses in our case "0x90F79bf6EB2c4f870365E785982E1f101E93b906". You can modify the script to generate proofs for other addresses.

    ```bash
    node createmerkleproof.js
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
  
- **Tree and Proof Generation:** The scripts provided (`createmerkletrees.js` and `createmerkleproof.js`) generate trees and proofs based on predefined values. You should modify the values to suit your airdrop requirements.

- **Preimage Attack Protection:** The `_verifyProof` function in the `MerkleDrop` contract double-hashes the data to prevent second preimage attacks.

- **Active Airdrop Toggle:** The contract includes a `toggleActive` function that allows the owner to enable or disable the airdrop claiming process.

## Running Tests

To run the tests, use:
```bash
npx hardhat test
```

