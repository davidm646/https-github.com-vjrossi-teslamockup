export interface VehicleData {
  id: number;
  vehicle_id: number;
  vin: string;
  display_name: string;
  state: string;
  charge_state: ChargeState;
  climate_state: ClimateState;
  drive_state: DriveState;
  vehicle_state: VehicleState;
}

export interface ChargeState {
  battery_level: number;
  battery_range: number;
  charge_energy_added: number;
  charge_limit_soc: number;
  charging_state: string; // "Disconnected", "Charging", "Complete"
  time_to_full_charge: number;
}

export interface ClimateState {
  inside_temp: number;
  outside_temp: number;
  driver_temp_setting: number;
  passenger_temp_setting: number;
  is_climate_on: boolean;
  seat_heater_left: number;
  seat_heater_right: number;
}

export interface DriveState {
  heading: number;
  latitude: number;
  longitude: number;
  speed: number | null;
  shift_state: string | null; // "D", "P", "R", "N"
}

export interface VehicleState {
  odometer: number;
  locked: boolean;
  sentry_mode: boolean;
  software_update: {
    status: string;
  };
  tire_pressure_front_left: number;
  tire_pressure_front_right: number;
  tire_pressure_rear_left: number;
  tire_pressure_rear_right: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isLoading?: boolean;
}

export enum AppMode {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}
