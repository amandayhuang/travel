import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
} from '@material-ui/core'

const Dropdown = ({ changeHandler, vals, name, label, options }) => {
  return (
    <Box width="200px" mr="15px">
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="outlined-age-native-simple">
          {label}
        </InputLabel>
        <Select
          native
          value={vals[name]}
          label={label}
          inputProps={{
            name,
            className: 'select',
          }}
          onChange={(e) => changeHandler(e, name)}
        >
          <option aria-label="None" value="" disabled />
          {options.map((option) => (
            <option value={option[0]} key={option[0]}>
              {option[1]}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default Dropdown
