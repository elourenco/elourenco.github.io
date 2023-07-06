import React from 'react';
import LeftHome from './left-home';
import RightHome from './right-home';

const Home = () => {
  return (
    <section
      id="home"
      className="w-full pt-10 pb-20 flex flex-col gap-10 xl:gap-0 lgl:flex-row items-center border-b-[1px] font-titleFont border-b-black"
    >
      <LeftHome />
      <RightHome />
    </section>
  );
};

export default Home;
