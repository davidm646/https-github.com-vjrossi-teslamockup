import { VehicleData } from '../types';

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

export const getVehicleData = async (token: string, useDemo: boolean = false): Promise<VehicleData> => {
  if (useDemo) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_VEHICLE;
  }

  // NOTE: Calling Tesla API directly from browser often triggers CORS errors.
  // In a real production app, this should go through a proxy server.
  // We will attempt the call, but if it fails, we throw an error that the UI handles.
  try {
    // 1. Get list of vehicles to find the ID
    const vehiclesResponse = await fetch('https://owner-api.teslamotors.com/api/1/vehicles', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!vehiclesResponse.ok) {
      throw new Error(`API Error: ${vehiclesResponse.statusText}. CORS or Invalid Token.`);
    }

    const vehiclesJson = await vehiclesResponse.json();
    const vehicleId = vehiclesJson.response[0].id_s;

    // 2. Get Vehicle Data
    const dataResponse = await fetch(`https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/vehicle_data`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!dataResponse.ok) {
      throw new Error('Failed to fetch vehicle data');
    }

    const dataJson = await dataResponse.json();
    return dataJson.response;

  } catch (error: any) {
    console.error("Tesla API Error:", error);
    throw error;
  }
};

export const toggleLock = async (token: string, vehicleId: number, locked: boolean): Promise<boolean> => {
   // In demo mode, we just return success
   if (token === 'demo') {
     await new Promise(r => setTimeout(r, 500));
     return true;
   }
   
   // Real API Call placeholder
   return true;
};
