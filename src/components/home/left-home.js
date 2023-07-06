import React from 'react';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useTranslation } from 'react-i18next';
import Skills from './skills';
import FindMe from './find-me';

const LeftHome = () => {
  const { t } = useTranslation();

  const [text] = useTypewriter({
    words: [
      t('professional.1'),
      t('professional.2'),
      t('professional.3'),
      t('professional.4'),
    ],
    loop: true,
    typeSpeed: 20,
    deleteSpeed: 10,
    delaySpeed: 2000,
  });
  return (
    <div className="w-full lgl:w-1/2 flex flex-col gap-20">
      <div className="flex flex-col gap-5">
        <h4 className=" text-lg font-normal">{t('title')}</h4>
        <h1 className="text-4xl font-bold text-white">
          {t('subTitle')}{' '}
          <span className="text-designColor capitalize">
            {t('fullName')}
          </span>
        </h1>
        <h2 className="text-2xl font-bold text-white">
          <span>{text}</span>
          <Cursor
            cursorBlinking="false"
            cursorStyle="|"
            cursorColor="#ff014f"
          />
        </h2>
        <p className="text-base font-bodyFont leading-6 tracking-wide">
          {t('description')}
        </p>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 lgl:gap-0 justify-between">
        <Skills />
        <FindMe />
      </div>
    </div>
  );
};

export default LeftHome;
