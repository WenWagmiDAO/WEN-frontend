import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";

import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as OhmDaiImg } from "src/assets/tokens/wen-dai.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { abi as BondOhmDaiContract } from "src/abi/bonds/OhmDaiContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveOhmDaiContract } from "src/abi/reserves/OhmDai.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { BigNumberish } from "ethers";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x40159B7309Cd82Bf5e8eb118dCAbe4781dDE2F68",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x1B6F86BC319e3B363aC5299c045Ae29D95d7A623",
      reserveAddress: "0xEF6834b5a29D75a883406B19f3eEefbF87b5031A",
    },
  },
});

// Old DAI
export const dai_old = new StableBond({
  name: "dai_old",
  displayName: "DAI (old)",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x7f4aea8a240a8f5c0e62eb387d1f929536e1b756",
      reserveAddress: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    [NetworkID.Testnet]: {
      bondAddress: "0x1B6F86BC319e3B363aC5299c045Ae29D95d7A623",
      reserveAddress: "0xEF6834b5a29D75a883406B19f3eEefbF87b5031A",
    },
  },
});

export const eth = new CustomBond({
  name: "ftm",
  displayName: "wFTM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wFTM",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: wETHImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xd7cbA20A464C10FB03Bbc265D962ADa8e29af118",
      reserveAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    const token = this.getContractForReserve(networkID, provider);

    let [ethPrice, ethAmount]: [BigNumberish, BigNumberish] = await Promise.all([
      ethBondContract.assetPrice(),
      token.balanceOf(addresses[networkID].TREASURY_ADDRESS),
    ]);

    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const ohm_dai = new LPBond({
  name: "wen_dai_lp",
  displayName: "WEN-DAI LP",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x538633080bCa332BA557eabBaA4d4B1E153df166", 
      reserveAddress: "0x0169721fdca4c1e201f9f44cec5fb1c0af356ae1",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x86D7BcCB91B1c5A01A7aD7D7D0eFC7106928c7F8",
});

// Old ohm_dai
export const ohm_dai_old = new LPBond({
  name: "wen_dai_lp_old",
  displayName: "WEN-DAI LP",
  bondToken: "DAI",
  isAvailable: { [NetworkID.Mainnet]: true },
  bondIconSvg: OhmDaiImg,
  bondContractABI: BondOhmDaiContract,
  reserveContract: ReserveOhmDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xc82514b8a3f4579abee1592eadd249d693a7213e", // if this is your bond address just paste in the new address
      reserveAddress: "0x0169721fdca4c1e201f9f44cec5fb1c0af356ae1",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  lpUrl:
    "https://spookyswap.finance/add/0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E/0x86D7BcCB91B1c5A01A7aD7D7D0eFC7106928c7F8",
});

// HOW TO ADD A NEW BOND (uwu):
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [dai, ohm_dai, dai_old, ohm_dai_old];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds: (StableBond | CustomBond | LPBond)[] = [];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
