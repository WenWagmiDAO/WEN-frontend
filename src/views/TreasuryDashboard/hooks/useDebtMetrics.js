import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";
import { debtQuery } from "../treasuryData";

export const useDebtMetrics = options => {
  return useQuery(
    "debt_metrics",
    async () => {
      const response = await apollo(debtQuery);

      // Transform string values to floats
      return response.data.bondDiscounts.map(metric =>
        Object.entries(metric).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
    },
    options,
  );
};
