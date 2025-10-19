import { createContext, useContext } from "react";

export const LocalMouseCoordinatesProvider = createContext({ x: 0, y: 0});
export const useLocalMouseCoords = () => {
  return useContext(LocalMouseCoordinatesProvider);
}
