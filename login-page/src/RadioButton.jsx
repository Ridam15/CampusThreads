import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';

export default function RadioButton({ value, handleChange }) {
    // const [value, setValue] = React.useState('Student');

    // const handleChange = (event) => {
    //     setValue((event.target.value));
    // };

    return (
        <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel value="student" control={<Radio />} label="Student" />
                <FormControlLabel value="Professor" control={<Radio />} label="Professor" />
            </RadioGroup>
        </FormControl>
    );
}