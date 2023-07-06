import React, { useCallback, useState } from 'react';
import { navLinksdata } from '../../constants';
import { BrasilFlag, EuaFlag } from '../../assets';
import Flag from './flag';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState();

  const handleChangeLanguage = useCallback(
    (language) => {
      setSelectedLanguage(language);
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  return (
    <div className="w-full h-16 max-auto  flex justify-between items-center font-titleFont px-6">
      <div>
        <span className="text-white-600 font-normal"> EDUARDO</span>
        <span className="text-yellow-600 font-bold">LOURENCO</span>
      </div>
      <div>
        <menu className="hidden mdl:inline-flex items-center gap-6 lg:gap-10">
          {navLinksdata.map(({ _id, link }) => (
            <li
              className="text-base font-normal text-gray-400 tracking-wide cursor-pointer hover:text-designColor duration-300"
              key={_id}
            >
              {t(`menu.${_id}`)}
            </li>
          ))}
          <li>
            <Flag
              image={BrasilFlag}
              isSelected={selectedLanguage === 'pt'} // check if en-US is selected
              onClick={() => handleChangeLanguage('pt')} // changes the language to en-US
            />
          </li>
          <li>
            <Flag
              image={EuaFlag}
              isSelected={selectedLanguage === 'en'} // check if en-US is selected
              onClick={() => handleChangeLanguage('en')} // changes the language to en-US
            />
          </li>
        </menu>
      </div>
    </div>
  );
};

export default NavBar;
