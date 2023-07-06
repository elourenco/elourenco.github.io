import React from 'react';
import { FaReact, FaAws } from 'react-icons/fa';
import { SiRubyonrails, SiNodedotjs, SiSwift } from 'react-icons/si';
import { useTranslation } from 'react-i18next';

const Skills = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between">
      <div>
        <h2 className="text-base uppercase font-titleFont mb-4">
          {t('skillOn')}
        </h2>
        <div className="flex gap-4">
          <span className="bannerIcon">
            <FaReact />
          </span>
          <span className="bannerIcon">
            <SiNodedotjs />
          </span>
          <span className="bannerIcon">
            <SiSwift />
          </span>
          <span className="bannerIcon">
            <SiRubyonrails />
          </span>
          <span className="bannerIcon">
            <FaAws />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Skills;
