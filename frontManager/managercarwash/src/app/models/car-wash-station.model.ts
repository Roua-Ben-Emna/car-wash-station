export interface CarWashStation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    location: string;
    maxCapacityCars: number;
    currentCarsInWash: number;
    manager: any; 
  }