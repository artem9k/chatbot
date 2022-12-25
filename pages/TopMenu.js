import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import Logo from'./notes.png';

import Image from 'next/image';

export default function TopMenu() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', 
      alignItems: 'center', 
      textAlign: 'center', 
      justifyContent:'center', 
      backgroundColor:"#2C2C2C", 
      height:"50px",
      borderBottom: "1px solid grey"}}>
        <Image src={Logo} alt="Notes.ai" height={15}/>
      </Box>
    </React.Fragment>
  );
}

