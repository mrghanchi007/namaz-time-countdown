import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface City {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
}

export const pakistaniCities: City[] = [
  {
    name: "Karachi",
    coordinates: { latitude: 24.8607, longitude: 67.0011 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Lahore", 
    coordinates: { latitude: 31.5204, longitude: 74.3587 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Islamabad",
    coordinates: { latitude: 33.6844, longitude: 73.0479 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Rawalpindi",
    coordinates: { latitude: 33.5651, longitude: 73.0169 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Faisalabad",
    coordinates: { latitude: 31.4504, longitude: 73.1350 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Multan",
    coordinates: { latitude: 30.1575, longitude: 71.5249 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Peshawar",
    coordinates: { latitude: 34.0151, longitude: 71.5249 },
    timezone: "Asia/Karachi"
  },
  {
    name: "Quetta",
    coordinates: { latitude: 30.1798, longitude: 66.9750 },
    timezone: "Asia/Karachi"
  }
];

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (cityName: string) => void;
}

export const CitySelector = ({ selectedCity, onCityChange }: CitySelectorProps) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <MapPin className="h-5 w-5 text-islamic-gold" />
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-48 bg-secondary/50 border-border/50">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border/50">
          {pakistaniCities.map((city) => (
            <SelectItem 
              key={city.name} 
              value={city.name}
              className="hover:bg-secondary/70 focus:bg-secondary/70"
            >
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};