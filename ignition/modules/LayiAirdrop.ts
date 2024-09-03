import {
  loadFixture,
  time
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Airdrop", function () {
  const merkleRoot = "0xdad72816f97715084a191a6a826bd9f1fad5ea7bf96dc7a9111319c6302a635b";
  const AirDropEndingTimeInSec = time.duration.seconds(30*24*60*60);
  
  async function deployLayiToken() {
    const [owner] = await ethers.getSigners();
    const erc20Token = await ethers.getContractFactory("LayintonToken");
    const token = await erc20Token.deploy();
    return { token, owner };
  }

  async function delpoyLayiAirdropDrop() {
 
    const { token } = await loadFixture(deployLayiToken);

    const [owner, other, addr1] = await ethers.getSigners();

   
    const LayiAirDrop = await ethers.getContractFactory("LayiAirDrop");
    const airdropAddress = await LayiAirDrop.deploy(token, merkleRoot, AirDropEndingTimeInSec);

    return { token, owner, other, airdropAddress, merkleRoot, addr1 };
  }

  describe("LayintonToken Deployment", function () {
    it("Should mint the right 1 Million tokens", async function () {
      const { token } = await loadFixture(deployLayiToken);

      const tokents = ethers.parseUnits("5000000", 18);

       expect(await token.totalSupply()).to.equal(tokents);
    });
  });


  describe("MerkleDrop Deployment", function () {
    it("Should set the correct Merkle root", async function () {
     
      const { token, owner, airdropAddress, merkleRoot } = await loadFixture(
        delpoyLayiAirdropDrop
      );

   
       expect(await airdropAddress.merkleRoot()).to.equal(merkleRoot);
    });

    it("Should set the correct token address", async function () {
    
      const { token, airdropAddress } = await loadFixture(
        delpoyLayiAirdropDrop
      );

     
       expect(token).to.equal(await airdropAddress.tokenAddress());
    });

    it("Should have the correct owner", async function () {
      // Load the MerkleDrop fixture
      const { owner, airdropAddress } = await loadFixture(
        delpoyLayiAirdropDrop
      );

    
       expect(owner.address).to.equal(await airdropAddress.owner());
    });
  });

  describe("Airdrop function", function () {
    it("Should claim airdrop", async function () {

      const { token, owner, airdropAddress, merkleRoot, addr1 } =
        await loadFixture(delpoyLayiAirdropDrop);

      
      const tokents = ethers.parseUnits("1000000", 18);


      await token.transfer(airdropAddress, tokents);


      const proof = [
        "0x5d76a71bd6d384317c384db87cc35e7b1b49606ffaca4572af7f37d037120a72",
        "0x5f8f6140f4928eb94c6d333b9942fe8199178ea0f1337b43970a92677153a18b",
        "0xc4b85746a83f0dd6a03a4b18b22c8ecb5fc810be93e7123b2e11fdabc5de05fc",
      ];
      const amount = ethers.parseUnits("20", 18);


      await airdropAddress.connect(addr1).claimAirDrop(proof, 1n, amount);

       expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });
  });
});