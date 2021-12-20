import { Paper, Box, Typography } from "@material-ui/core";
import { bulletpoints } from "src/views/TreasuryDashboard/treasuryData";
import "./customtooltip.scss";

const renderDate = (index, payload, item) => {
  return index === payload.length - 1 ? (
    <div className="tooltip-date">
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).charAt(0).toUpperCase()}
      {new Date(item.payload.timestamp * 1000).toLocaleString("default", { month: "long" }).slice(1)}
      &nbsp;
      {new Date(item.payload.timestamp * 1000).getDate()}, {new Date(item.payload.timestamp * 1000).getFullYear()}
    </div>
  ) : (
    ""
  );
};

const renderItem = (type, item) => {
  return type === "$" ? (
    <Typography variant="body2">{`${type}${Math.round(item).toLocaleString("en-US")}`}</Typography>
  ) : type ==="%" ? (
    <Typography variant="body2">{`${item.toLocaleString("en-us")}${type}`}</Typography>
  ) : (
    <Typography variant="body2">{`${item.toFixed(2)} ${type}`}</Typography>
  );
};

const renderTooltipItems = (payload, bulletpointColors, itemNames, itemType, isStaked = false, isPOL = false, isDilution = false) => {
  return isStaked ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          Staked
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
          Not staked
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : isPOL ? (
    <Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={bulletpointColors[0]}></span>
          {itemNames[0]}
        </Typography>
        <Typography>{`${Math.round(payload[0].value)}%`}</Typography>
      </Box>
      <Box className="item" display="flex" justifyContent="space-between">
        <Typography variant="body2" className="field-name">
          <span className="tooltip-bulletpoint" style={bulletpointColors[1]}></span>
          {itemNames[1]}
        </Typography>
        <Typography>{`${Math.round(100 - payload[0].value)}%`}</Typography>
      </Box>
      <Box>{renderDate(0, payload, payload[0])}</Box>
    </Box>
  ) : (
    payload.map((item, index) => (
      <Box key={index}>
        <Box className="item" display="flex">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" className="field-name">
              <span className="tooltip-bulletpoint" style={bulletpointColors[index]}></span>
              {`${itemNames[index]}`}
            </Typography>
          </Box>
          {renderItem(isDilution ? itemType[index] : itemType, item.value)}
        </Box>
        <Box>{renderDate(index, payload, item)}</Box>
      </Box>
    ))
  );
};

function CustomTooltip({ active, payload, bulletpointColors, itemNames, itemType, isStaked, isPOL, isDilution }) {
  if (active && payload && payload.length) {
    return (
      <Paper className={`ohm-card tooltip-container`}>
        {renderTooltipItems(payload, bulletpointColors, itemNames, itemType, isStaked, isPOL, isDilution)}
      </Paper>
    );
  }
  return null;
}

export default CustomTooltip;
