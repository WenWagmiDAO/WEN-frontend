import { useQuery } from "react-query";
import { THE_GRAPH_URL_ETH } from "src/constants";
import { apolloExt } from "src/lib/apolloClient";
import { treasuryOhmQuery } from "../treasuryData";

export const useTreasuryOhm = options => {
  return useQuery(
    "treasury_ohm",
    async () => {
      const response = await apolloExt(treasuryOhmQuery, THE_GRAPH_URL_ETH);

      // Transform string values to floats
      return response.data.balances.map(metric =>
        Object.entries(metric).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
    },
    options,
  );
};
