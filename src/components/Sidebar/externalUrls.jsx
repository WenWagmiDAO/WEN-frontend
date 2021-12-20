import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

const externalUrls = [
  {
    title: <Trans>Buy on SpookySwap</Trans>,
    url: "https://spookyswap.finance/swap?inputCurrency=0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E&outputCurrency=0x86d7bccb91b1c5a01a7ad7d7d0efc7106928c7f8",
    icon: (
      <span>
        <ShoppingCartIcon />
      </span>
    ),
  },
  {
    title: <Trans>Chart on Dextools</Trans>,
    url: "https://www.dextools.io/app/fantom/pair-explorer/0x0169721fdca4c1e201f9f44cec5fb1c0af356ae1",
    icon: (
      <span>
        <TrendingUpIcon />
      </span>
    ),
  },
];

export default externalUrls;
