import React from 'react';
import { Logo } from '../../assets/index';

const RightHome = () => {
  return (
    <div className="w-full lgl:w-1/2 flex justify-center items-center">
      <img className="h-50 w-50" src={Logo} alt="Eduardo Lourenço" />
    </div>
  );
};

export default RightHome;
