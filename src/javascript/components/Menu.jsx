import { Menu, MenuItem, Chip } from '@material-ui/core'
import React, { useState } from 'react'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  label: {
    paddingLeft: '4px !important',
    paddingRight: '4px !important',
  },
}))

const IsolatedMenu = ({
  idx,
  icon,
  sortedTiles,
  setMyTiles,
  hiddenText,
  chowText,
  removeHandler,
  hidden,
  chow,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()

  const hiddenHandler = (idx) => {
    sortedTiles[idx].hidden = !sortedTiles[idx].hidden
    setMyTiles(sortedTiles)
    setAnchorEl(null)
  }

  const chowHandler = (idx) => {
    sortedTiles[idx].chow = !sortedTiles[idx].chow
    setMyTiles(sortedTiles)
    setAnchorEl(null)
  }

  const InnerChip = () => {
    return (
      <>
        {hidden && <VisibilityOffIcon className="eye" />}
        {chow && <FormatListNumberedIcon className="eye" />}
      </>
    )
  }

  return (
    <>
      <Chip
        label={icon}
        onDelete={() => removeHandler(idx)}
        color="primary"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        classes={classes}
        className={`${classes.label} chip`}
        icon={<InnerChip />}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => hiddenHandler(idx)}>
          {`${hiddenText} as Concealed`}{' '}
          <VisibilityOffIcon className="icon" />
        </MenuItem>
        <MenuItem onClick={() => chowHandler(idx)}>
          {`${chowText} as Chow`}{' '}
          <FormatListNumberedIcon className="icon" />
        </MenuItem>
      </Menu>
    </>
  )
}

export default IsolatedMenu
