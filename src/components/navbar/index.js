import React, { useCallback, useState } from 'react';
import { navLinksdata } from '../../constants';
import { BrasilFlag, EuaFlag } from '../../assets';
import { Link } from 'react-scroll';
import { FiMenu } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import Flag from './flag';
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showMenu, setShowMenu] = useState(false);

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
        <span
          onClick={() => setShowMenu(!showMenu)}
          className="text-xl mdl:hidden bg-black w-10 h-10 inline-flex items-center justify-center rounded-full text-designColor cursor-pointer"
        >
          <FiMenu />
        </span>
        {showMenu && (
          <div className="w-[80%] h-screen overflow-scroll absolute top-0 left-0 bg-gray-900 p-4 scrollbar-hide">
            <div className="flex flex-col gap-8 py-2 relative">
              <ul className="flex flex-col gap-4">
                {navLinksdata.map(({ _id, link }) => (
                  <li
                    key={_id}
                    className="text-base font-normal text-gray-400 tracking-wide cursor-pointer hover:text-designColor duration-300"
                  >
                    <Link
                      onClick={() => setShowMenu(false)}
                      activeClass="active"
                      to={link}
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                    >
                      {t(`menu.${_id}`)}
                    </Link>
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
              </ul>
              <span
                onClick={() => setShowMenu(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-designColor duration-300 text-2xl cursor-pointer"
              >
                <MdClose />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
