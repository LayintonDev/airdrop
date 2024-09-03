import {
  loadFixture,
  time
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Airdrop", function () {
  const merkleRoot = "0x497a21d51900670542738e7ad5c23bad76d18cadc83d2382428a4e4be837f162";
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
    const testAddress = await ethers.getSigner("0x90F79bf6EB2c4f870365E785982E1f101E93b906");

   
    const LayiAirDrop = await ethers.getContractFactory("LayiAirDrop");
    const airdropAddress = await LayiAirDrop.deploy(token, merkleRoot, AirDropEndingTimeInSec);

    return { token, owner, other, airdropAddress, merkleRoot, addr1, testAddress };
  }

  describe("LayintonToken Deployment", function () {
    it("Should check that it has the correct number of tokens minted", async function () {
      const { token } = await loadFixture(deployLayiToken);

      const tokents = ethers.parseUnits("500000", 18);

       expect(await token.totalSupply()).to.equal(tokents);
    });
  });


  describe("LayitonAirdrop Deployment", function () {
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

      const { token, owner, airdropAddress, merkleRoot, testAddress } =
        await loadFixture(delpoyLayiAirdropDrop);

      
      const tokents = ethers.parseUnits("100000", 18);


      await token.transfer(airdropAddress, tokents);


      const proof = [
      '0x9c2c52f8fdbb115f3f498d9eff09e9541c59355a9244f8777b737cd771e34881',
  '0xf9828ab50922dcbcce049075b73b72e405313c393fdfb6cd74b5f70cd13065f3',
  '0x933ac483017681af59876edce64112e940769889496b034ad7d05dd2a0deb8ca'
      ];
      const amount = ethers.parseUnits("30", 18);


      await airdropAddress.connect(testAddress).claimAirDrop(proof, 1n, amount);

       expect(await token.balanceOf(testAddress.address)).to.equal(amount);
    });
  });
});