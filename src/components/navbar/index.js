import React from 'react';
import { navLinksdata } from '../../constants';

const NavBar = () => {
  return (
    <div className="w-full h-16 max-auto  flex justify-between items-center font-titleFont">
      <div>
        EDUARDO
        <span className="text-yellow-600 font-bold">LOURENCO</span>
      </div>
      <div>
        <menu className="hidden mdl:inline-flex items-center gap-6 lg:gap-10">
          {navLinksdata.map(({ _id, title, link }) => (
            <li
              className="text-base font-normal text-gray-400 tracking-wide cursor-pointer hover:text-designColor duration-300"
              key={_id}
            >
              {title}
            </li>
          ))}
        </menu>
      </div>
    </div>
  );
};

export default NavBar;
