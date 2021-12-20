export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/hovoh/wen-subgraph"; // change this wagmis when deployed
export const THE_GRAPH_URL_ETH = "https://api.thegraph.com/subgraphs/name/exodiafinance/exodia-eth-treasury";
export const EPOCH_INTERVAL = 300;

// NOT USED ANY MORE: Fetched from the blockchain `useAppSelector(state => state.app.blockRateSeconds)`
export const BLOCK_RATE_SECONDS = 0.9;

export const TOKEN_DECIMALS = 9;

export const OHM_TICKER = "WEN";
export const sOHM_TICKER = "sWEN";
export const wsOHM_TICKER = "wsWEN";

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  250: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  250: {
    // WENIAAAAAAAAA
    DAI_ADDRESS: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E", // OKAY
    OHM_ADDRESS: "0x86D7BcCB91B1c5A01A7aD7D7D0eFC7106928c7F8", // OKAY
    STAKING_ADDRESS: "0x1a16805c1e60e7bf206304efdf31e7b8a151235b", // The new staking contract // OKAY
    STAKING_HELPER_ADDRESS: "0xaf9e3ce67bd74570fc3e3b4c1b985c2af0f0d0dc", // Helper contract used for Staking only // OKAY
    SOHM_ADDRESS: "0x74d02d9cfe67f1fc60019db470b46f5b0dc82b32", // OKAY
    WSOHM_ADDRESS: "0xe992C5Abddb05d86095B18a158251834D616f0D1", // OKAY
    DISTRIBUTOR_ADDRESS: "0xef171963a1ca74eaa47cd98f3d53a44269fbcff8", // OKAY
    BONDINGCALC_ADDRESS: "0xffb293e20babd58cb10d3c3640b2806da63ad4a8", // OKAY
    CIRCULATING_SUPPLY_ADDRESS: "0x86D7BcCB91B1c5A01A7aD7D7D0eFC7106928c7F8", // OKAY
    TREASURY_ADDRESS: "0x25b6e27a7279ae1ea95d29078d1d35200813035c", // OKAY
    REDEEM_HELPER_ADDRESS: "0xaf9e3ce67bd74570fc3e3b4c1b985c2af0f0d0dc", // OKAY
    PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS // xxxIGNORExxx
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW // xxxIGNORExxx
    PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW // xxxIGNORExxx
  },
  4002: {
    DAI_ADDRESS: "0xEF6834b5a29D75a883406B19f3eEefbF87b5031A", // ok
    OHM_ADDRESS: "0xD5A6853d76D39597D3B29ec66811f8246b78bA0b", // ok
    STAKING_ADDRESS: "0xD107b5E9cFCb4FD3aae8D139C814F19ed2547940", // ok
    STAKING_HELPER_ADDRESS: "0xb514E20e244812380996a57ba0daE0F60fc2Ff5f", // ok
    SOHM_ADDRESS: "0x055B72A75c77a27d576f47A0821DBD198EBafdc3", // ok
    WSOHM_ADDRESS: "0x133f6D7d457377bfA6a43933127498fA40ef11CF", // ok
    DISTRIBUTOR_ADDRESS: "0xAF10E46D8bd5DF0234CAc8fECE2FF9438301ccB5", // ok
    BONDINGCALC_ADDRESS: "0x5f2CfF691065eAf57Edf90B660BA007A956AFd56", // ok
    CIRCULATING_SUPPLY_ADDRESS: "0x3fB1B92239835F0413E028f591A7AF1a4D02a03c",
    TREASURY_ADDRESS: "0x1d2ec2C0c375a38C78e4342e8F6A730201CCEb41", // ok
    REDEEM_HELPER_ADDRESS: "0x9bb05525A05A121dE0508408E26adc208beD3888", // ok
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b", // NEW
  },
};
