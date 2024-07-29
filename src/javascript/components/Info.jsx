import React, { useState } from 'react'
import { Tooltip } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { withStyles, makeStyles } from '@material-ui/core/styles'

const Info = ({ text }) => {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false)

  const StyledTooltip = withStyles((theme) => ({
    tooltip: {
      fontSize: 12,
    },
  }))(Tooltip)

  return (
    <StyledTooltip
      title={text}
      open={tooltipIsOpen}
      onOpen={() => setTooltipIsOpen(true)}
      onClose={() => setTooltipIsOpen(false)}
      placement="top-start"
    >
      <InfoIcon
        size={3}
        className="info"
        onClick={() => setTooltipIsOpen(!tooltipIsOpen)}
      />
    </StyledTooltip>
  )
}

export default Info
