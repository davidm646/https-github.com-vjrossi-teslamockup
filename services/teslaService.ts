import { VehicleData } from '../types';
import { 
  setAuthToken, 
  removeAuthToken, 
  fetchVehicleData, 
  wakeUpVehicle as wakeUpAction,
  sendCommand as sendCommandAction 
} from './actions';

// Mock data for "Demo Mode"
const MOCK_VEHICLE: VehicleData = {
  id: 123456789,
  vehicle_id: 987654321,
  vin: "5YJ3E1EA0KF123456",
  display_name: "CyberRunner",
  state: "online",
  charge_state: {
    battery_level: 78,
    battery_range: 245.5,
    charge_energy_added: 12.4,
    charge_limit_soc: 90,
    charging_state: "Disconnected",
    time_to_full_charge: 0,
  },
  climate_state: {
    inside_temp: 22.5,
    outside_temp: 18.0,
    driver_temp_setting: 21.0,
    passenger_temp_setting: 21.0,
    is_climate_on: true,
    seat_heater_left: 0,
    seat_heater_right: 0,
  },
  drive_state: {
    heading: 180,
    latitude: 37.7749,
    longitude: -122.4194,
    speed: null,
    shift_state: "P",
  },
  vehicle_state: {
    odometer: 15420,
    locked: true,
    sentry_mode: true,
    software_update: {
      status: "",
    },
    tire_pressure_front_left: 42,
    tire_pressure_front_right: 41,
    tire_pressure_rear_left: 42,
    tire_pressure_rear_right: 42,
  },
};

// Local storage key for demo persistence
const DEMO_MODE_KEY = 'tesla_demo_mode';

const isDemoMode = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
};

export const login = async (token: string, useDemo: boolean): Promise<VehicleData> => {
  if (useDemo) {
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    await new Promise(r => setTimeout(r, 800)); // Simulate delay
    return MOCK_VEHICLE;
  }
  
  localStorage.removeItem(DEMO_MODE_KEY);
  await setAuthToken(token);
  return await fetchVehicleData();
};

export const logout = async () => {
  localStorage.removeItem(DEMO_MODE_KEY);
  await removeAuthToken();
};

export const getVehicle = async (): Promise<VehicleData> => {
  if (isDemoMode()) {
    // Randomize slightly for "live" feel in demo
    const mock = { ...MOCK_VEHICLE };
    mock.climate_state = { ...mock.climate_state, inside_temp: 22 + Math.random() };
    return mock;
  }
  
  return await fetchVehicleData();
};

export const wakeUp = async (vehicleId: number): Promise<boolean> => {
  if (isDemoMode()) {
    await new Promise(r => setTimeout(r, 2000));
    return true;
  }
  return await wakeUpAction(vehicleId);
};

export const toggleLock = async (vehicleId: number, locked: boolean): Promise<boolean> => {
   if (isDemoMode()) {
     await new Promise(r => setTimeout(r, 500));
     return true;
   }
   
   const command = locked ? 'door_lock' : 'door_unlock';
   const result = await sendCommandAction(vehicleId, command);
   return result.result;
};