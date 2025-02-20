import React from 'react';

const HeaderUnlogged = () => {
  return (
    <header className='p-5'>
        <div className="justify-end flex">
            <button className="bg-gray-custom text-black-custom text-sm px-2 py-1 mx-2 rounded-lg border-custom">Inicia Sesión</button>
            <button className="bg-black-custom text-gray-custom text-sm px-2 py-1 rounded-lg">Registrate</button>
        </div>
    </header>
  );
};

export default HeaderUnlogged;