import React from 'react';
import { Link } from 'react-router-dom';

function MainEvent() {
  return (
    <section id="parallax-1" style={{ backgroundImage: `url(/img/main/parallax-bg.png)`, paddingTop: '200px', paddingBottom: '130px' }}>
      <div className="container">
        <div >
            <div className="text-center">
             <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              BELLEANGE
              </h1>
             <p className="mt-4 text-xl text-gray-600">
                벨앙주 멤버십 혜택
              </p>
            </div>
            <div className='text-center mt-4'>
            <Link
                to="/event"
                className="inline-block rounded-md border border-transparent bg-red-200 px-8 py-3 text-center font-medium text-white hover:bg-red-300"
              >
                Event
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
}

export default MainEvent;
