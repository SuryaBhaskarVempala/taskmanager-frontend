import React, { useState, useEffect } from 'react';

const DeviceCheckBox = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setIsSmallDevice(true); // You can adjust the breakpoint here
      } else {
        setIsSmallDevice(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isSmallDevice && (
        <div className="device-box">
          <div className="device-box-content">
            <h3 className="device-box-title">Notice for Smaller Devices</h3>
            <p>This website is designed for desktop devices. Some features may not work properly on smaller screens.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceCheckBox;
