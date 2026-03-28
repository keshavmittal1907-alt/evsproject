// Formula translating raw ambient PM2.5 concentrations to the Indian National Air Quality Index (NAQI)
// Using standard interpolation piecewise scaling

export const calculateIndianAQI = (pm25) => {
  if (pm25 === undefined || pm25 === null || pm25 === '--' || isNaN(pm25)) return '--';
  const c = parseFloat(pm25);
  if (c < 0) return 0;
  
  let b_low, b_high, i_low, i_high;

  // Indian NAQI breakpoints for PM2.5 (µg/m³) -> AQI Value
  if (c <= 30) { 
    b_low = 0; b_high = 30; i_low = 0; i_high = 50; 
  } else if (c <= 60) { 
    b_low = 31; b_high = 60; i_low = 51; i_high = 100; 
  } else if (c <= 90) { 
    b_low = 61; b_high = 90; i_low = 101; i_high = 200; 
  } else if (c <= 120) { 
    b_low = 91; b_high = 120; i_low = 201; i_high = 300; 
  } else if (c <= 250) { 
    b_low = 121; b_high = 250; i_low = 301; i_high = 400; 
  } else { 
    b_low = 251; b_high = 1000; i_low = 401; i_high = 500; 
  } 

  const aqi = ((i_high - i_low) / (b_high - b_low)) * (c - b_low) + i_low;
  return Math.round(aqi);
};
