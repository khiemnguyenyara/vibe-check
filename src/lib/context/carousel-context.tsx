"use client";

import { createContext, useContext, useState } from "react";

type CarouselContextType = {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
};

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export function CarouselProvider({ children }: { children: React.ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <CarouselContext.Provider value={{ currentSlide, setCurrentSlide }}>
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within CarouselProvider");
  }
  return context;
}
