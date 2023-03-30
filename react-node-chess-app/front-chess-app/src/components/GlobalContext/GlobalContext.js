import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [globalElo, setGlobalElo] = useState(sessionStorage.getItem('globalElo') || null);

    const updateGlobalElo = (elo) => {
        sessionStorage.setItem('globalElo', elo);
        setGlobalElo(elo);
    };

    return (
        <GlobalContext.Provider value={{ globalElo, updateGlobalElo }}>
            {children}
        </GlobalContext.Provider>
    );

};
