import React from 'react'
import { Checkbox, FormControlLabel, Box } from '@material-ui/core'
import Info from './Info'

const Check = ({ changeHandler, vals, name, label, infoText }) => {
  return (
    <Box display="flex" alignItems="center">
      <FormControlLabel
        value={name}
        control={
          <Checkbox
            color="primary"
            inputProps={{
              name,
            }}
            checked={vals[name]}
          />
        }
        label={label}
        labelPlacement="end"
        onChange={(e) => changeHandler(e, name)}
      />
      {infoText && (
        <Box alignSelf="end" pt="7px">
          <Info text={infoText} />
        </Box>
      )}
    </Box>
  )
}

export default Check
