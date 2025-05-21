import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function Dropdown() {
  const [period, setPeriod] = useState('');

  const handleChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <FormControl sx={{ width: "30%", margin: "auto", marginBottom: "20px", marginTop: "10px", backgroundColor: '#f2f2f2'}}>
      <InputLabel id="drop-down">Period</InputLabel>
      <Select
        labelId="drop-down"
        id="dropdown"
        value={period}
        label="Period"
        onChange={handleChange}
      >
        <MenuItem value={10}>First Quater</MenuItem>
        <MenuItem value={20}>Second Quater</MenuItem>
        <MenuItem value={30}>Third Quarter</MenuItem>
      </Select>
    </FormControl>
  );
}