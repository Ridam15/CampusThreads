import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Feed from './Feed';
import Doubts from './Doubts';

export default function ColorTabs() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (


    <Box sx={{ width: '100%' }} className=" mt-5 ml-48 ">
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Your Posts" />
        <Tab value="two" label="Your Q&A" />
      </Tabs>

      {value === 'one' && (
        <TabPanel value={value} index="one">
          <Feed />
        </TabPanel>
      )}
      {value === 'two' && (
        <TabPanel value={value} index="two">
          {/* Replace 'Doubts' with the actual component you want to display */}
          <Doubts />
        </TabPanel>
      )}
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}