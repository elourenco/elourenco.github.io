import React from 'react';
import { FaLinkedinIn } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FindMe = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between">
      <div>
        <h2 className="text-base uppercase font-titleFont mb-4">
          {t('findMe')}
        </h2>
        <div className="flex gap-4">
          <span className="bannerIcon">
            <FaLinkedinIn />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FindMe;
