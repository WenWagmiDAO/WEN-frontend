import styled from "styled-components";
import { Trans } from "@lingui/macro";
import { IPendingTx, isPendingTxn } from "../slices/PendingTxnsSlice";

type TxnButtonTextProps = {
  pendingTransactions: IPendingTxn[],
  type: string,
  defaultText: any,
  size?: string,
};

const TxnButtonText = ({ pendingTransactions, type, defaultText, size = "small" }: TxnButtonTextProps) => {
  return isPendingTxn(pendingTransactions, type) ? (
    <TextContainer>
      <Trans>Pending...</Trans>
    </TextContainer>
  ) : (
    defaultText
  );
};

export default TxnButtonText;

export const TxnButtonTextGeneralPending = ({
  pendingTransactions,
  type,
  defaultText,
  size = "small",
}: TxnButtonTextProps) => {
  return pendingTransactions.length >= 1 ? (
    <TextContainer>
      <Trans>Pending...</Trans>
    </TextContainer>
  ) : (
    defaultText
  );
};

const SIZES: { [key: string]: string } = {
  xl: "4rem",
  large: "3rem",
  medium: "2rem",
  small: "1.5rem",
  xs: "1rem",
};

const LoadingSpinner = ({ size = "medium" }) => {
  return (
    <Container>
      <svg className="progress-ring" height={SIZES[size]} viewBox="0 0 120 120">
        <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="hsl(99, 73%, 33%)" />
            <stop offset="50%" stop-color="hsl(100, 78%, 38%)" />
            <stop offset="100%" stop-color="hsl(99, 73%, 33%)" />
          </linearGradient>
        </defs>
        <circle
          className="progress-ring__circle_1"
          stroke-width="12"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          stroke="url(#linear)"
        />
        <circle
          className="progress-ring__circle_2"
          stroke-width="6"
          fill="transparent"
          r="17"
          cx="60"
          cy="60"
          stroke="url(#linear)"
        />
        <circle
          className="progress-ring__circle_3"
          stroke-width="6"
          fill="transparent"
          r="14"
          cx="60"
          cy="15"
          stroke="url(#linear)"
        />
        <line
          className="progress-ring__line_1"
          x1="13"
          y1="60"
          x2="42"
          y2="60"
          stroke-width="6"
          stroke="url(#linear)"
        />
        <line
          className="progress-ring__line_2"
          x1="78"
          y1="60"
          x2="107"
          y2="60"
          stroke-width="6"
          stroke="url(#linear)"
        />
        <line
          className="progress-ring__line_3"
          x1="60"
          y1="78"
          x2="60"
          y2="107"
          stroke-width="6"
          stroke="url(#linear)"
        />
        <line
          className="progress-ring__line_4"
          x1="60"
          y1="42"
          x2="60"
          y2="30"
          stroke-width="6"
          stroke="url(#linear)"
        />
      </svg>
    </Container>
  );
};

const TextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  transition: opacity 0.25s;
  animation: main_opacity 3s linear infinite;
  opacity: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;

  svg {
    filter: drop-shadow(0px 0px 5px hsl(100, 78%, 38%));
  }
  @keyframes main_opacity {
    0% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .progress-ring__circle_1 {
    stroke-dasharray: 327 327;
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    animation: circle_1 3s linear infinite;
  }

  @keyframes circle_1 {
    0% {
      stroke-dashoffset: 327;
    }
    10% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .progress-ring__circle_2 {
    stroke-dasharray: 107 107;
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    animation: circle_2 3s linear infinite;
  }

  @keyframes circle_2 {
    0% {
      stroke-dashoffset: 107;
    }
    10% {
      stroke-dashoffset: 107;
    }
    20% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .progress-ring__circle_3 {
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    animation: circle_3 3s linear infinite;
    stroke-dasharray: 88 88;
  }

  @keyframes circle_3 {
    0% {
      stroke-dashoffset: 88;
    }
    60% {
      stroke-dashoffset: 88;
    }
    70% {
      stroke-dashoffset: 44;
    }
    100% {
      stroke-dashoffset: 44;
    }
  }

  .progress-ring__line_1 {
    transition: stroke-dashoffset 0.35s;
    animation: line_1 3s linear infinite;
    stroke-dasharray: 36;
    stroke-dashoffset: 0;
  }

  @keyframes line_1 {
    0% {
      stroke-dashoffset: -36;
    }
    20% {
      stroke-dashoffset: -36;
    }
    30% {
      stroke-dashoffset: 0;
    }
  }

  .progress-ring__line_2 {
    transition: stroke-dashoffset 0.35s;
    animation: line_2 3s linear infinite;
    stroke-dasharray: 36;
  }

  @keyframes line_2 {
    0% {
      stroke-dashoffset: 36;
    }
    30% {
      stroke-dashoffset: 36;
    }
    40% {
      stroke-dashoffset: 0;
    }
  }

  .progress-ring__line_3 {
    transition: stroke-dashoffset 0.35s;
    animation: line_3 3s linear infinite;
    stroke-dasharray: 36;
  }

  @keyframes line_3 {
    0% {
      stroke-dashoffset: 36;
    }
    40% {
      stroke-dashoffset: 36;
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  .progress-ring__line_4 {
    transition: stroke-dashoffset 0.35s;
    animation: line_4 3s linear infinite;
    stroke-dasharray: 36;
  }

  @keyframes line_4 {
    0% {
      stroke-dashoffset: 36;
    }
    50% {
      stroke-dashoffset: 36;
    }
    60% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
`;
