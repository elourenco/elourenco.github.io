import React from 'react';

const Flag = ({ image, isSelected, ...props }) => (
  <img
    alt="flag"
    src={image}
    className={isSelected ? 'w-6 h-6' : 'w-6 h-6'}
    {...props}
  />
);

export default Flag;
