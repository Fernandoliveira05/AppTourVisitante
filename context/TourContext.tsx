// context/TourContext.tsx
import React, { createContext, useContext, useState } from "react";

type TourInfo = {
  tourId: number;
  checkpointId?: number;
} | null;

type TourContextType = {
  tour: TourInfo;
  setTour: (info: TourInfo) => void;
};

const TourContext = createContext<TourContextType>({
  tour: null,
  setTour: () => {},
});

type TourState = {
  tourId: number | null;
  checkpointId: number | null;
  roboId: number | null;
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tour, setTour] = useState<TourInfo>(null);

  return (
    <TourContext.Provider value={{ tour, setTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);