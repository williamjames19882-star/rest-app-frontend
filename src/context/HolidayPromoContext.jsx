import React, { createContext, useContext, useState } from 'react';

const HolidayPromoContext = createContext();

export const useHolidayPromo = () => {
  const context = useContext(HolidayPromoContext);
  if (!context) {
    throw new Error('useHolidayPromo must be used within HolidayPromoProvider');
  }
  return context;
};

export const HolidayPromoProvider = ({ children }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const hidePopup = () => {
    setIsPopupVisible(false);
    // Also store dismissal for today
    localStorage.setItem('holidayPromoDismissed', new Date().toDateString());
  };

  return (
    <HolidayPromoContext.Provider value={{ isPopupVisible, showPopup, hidePopup }}>
      {children}
    </HolidayPromoContext.Provider>
  );
};

