import { t } from "@lingui/macro";

// TODO: add paramaterization
export const treasuryDataQuery = `
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedOhm
    treasuryDaiRiskFreeValue
    treasuryDaiMarketValue
    treasuryWETHMarketValue
    treasuryGOhmBalance
    currentAPY
    runway10k
    runway20k
    runway50k
    runway7dot5k
    runway5k
    runway2dot5k
    runwayCurrent
    holders
    treasuryOhmDaiPOL
    index
    ohmMinted
  }
}
`;

export const rebasesDataQuery = `
query {
  rebases(orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}
`;

export const treasuryOhmQuery = `
query {
  balances(first: 100, orderBy: timestamp, orderDirection: desc) {
    sOHMBalanceUSD
    gOhmPrice
  }
}
`;

export const debtQuery = `
query {
  bondDiscounts(first: 1000, orderBy: timestamp, orderDirection: desc) {
    dai_debt_ratio
    eth_debt_ratio
    ohmdai_debt_ratio
    timestamp
  }
}
`;

// export default treasuryData;
export const bulletpoints = {
  tvl: [
    {
      right: 20,
      top: -12,
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
  ],
  coin: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, #F5AC37 -10%, #EA9276 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #DC30EB -10%, #EA98F1 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #4C8C2A -10%, #8BFF4D 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #c9184a -10%, #ff758f 100%)",
    },
  ],
  rfv: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, #F5AC37 -10%, #EA9276 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "linear-gradient(180deg, #768299 -10%, #98B3E9 100%)",
    },
    {
      right: 29,
      top: -12,
      background: "linear-gradient(180deg, #c9184a -10%, #ff758f 100%)",
    },
  ],
  holder: [
    {
      right: 40,
      top: -12,
      background: "#A3A3A3",
    },
  ],
  apy: [
    {
      right: 20,
      top: -12,
      background: "#49A1F2",
    },
  ],
  runway: [
    {
      right: 45,
      top: -12,
      background: "#000000",
    },
    {
      right: 48,
      top: -12,
      background: "#2EC608",
    },
    {
      right: 48,
      top: -12,
      background: "#49A1F2",
    },
    {
      right: 48,
      top: -12,
      background: "#c9184a",
    },
  ],
  staked: [
    {
      right: 45,
      top: -11,
      background: "linear-gradient(180deg, #55EBC7 -10%, rgba(71, 172, 235, 0) 100%)",
    },
    {
      right: 68,
      top: -12,
      background: "rgba(151, 196, 224, 0.2)",
      border: "1px solid rgba(54, 56, 64, 0.5)",
    },
  ],
  pol: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, rgba(56, 223, 63, 1) -10%, rgba(182, 233, 152, 1) 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "rgba(219, 242, 170, 1)",
      border: "1px solid rgba(118, 130, 153, 1)",
    },
  ],
  dilution: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, #F5AC37 -10%, #EA9276 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "linear-gradient(180deg, #55EBC7 -10%, #47ACEB 100%)",
    },
  ],
};

export const tooltipItems = {
  tvl: [t`Total Value Deposited`],
  coin: [t`DAI`, t`wFTM`, t`gOHM`],
  rfv: [t`DAI`],
  holder: [t`WagmiWenns`],
  apy: [t`APY`],
  runway: [t`Current`, t`7.5K APY`, t`5K APY`, t`2.5K APY`],
  pol: [t`spLP Treasury`, t`Market spLP`],
  dilution: [t`Dilution Percentage`, t`Current Index`],
  minted: [t`WEN minted`],
  mcs: [t`WEN Minted/Total Supply`],
  debtratio: [t`DAI Debt Ratio`, t`wFTM Debt Ratio`, t`WEN-DAI spLP Debt Ratio`],
};

export const tooltipInfoMessages = {
  tvl: t`Total Value Deposited, is the dollar amount of all WEN staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
  mvt: t`Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury.`,
  rfv: t`Risk Free Value, is the amount of funds the treasury guarantees to use for backing WEN.`,
  pol: t`Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.`,
  holder: t`Holders, represents the total number of WagmiWenns (sWEN holders)`,
  staked: t`WEN Staked, is the ratio of sWEN to WEN (staked vs unstaked)`,
  apy: t`Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.`,
  runway: t`Runway, is the number of days sWEN emissions can be sustained at a given rate. Lower APY = longer runway`,
  dilution: t`Dilution, is the ratio between index growth and total supply growth. It indicates how much stakers have been diluted. Slower decline is better.`,
  minted: t`WEN Minted, is the number of WEN minted each day from bonds`,
  mcs: t`WEN minted/Total Supply, is the number of WEN minted from bonds over total supply of WEN.`,
  debtratio: t`Debt ratio, is a metric that tells you how much WEN is currently vesting in relation to the total WEN supply. The numbers dont reflect the actual values, but, it can be used to form an impression of how much WEN is being minted from bonding in relation to the total supply.`,
};

export const itemType = {
  dollar: "$",
  percentage: "%",
  OHM: "WEN",
};
