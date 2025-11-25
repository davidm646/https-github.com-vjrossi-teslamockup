'use server';

import { cookies } from 'next/headers';
import { VehicleData } from '../types';

const BASE_URL = 'https://owner-api.teslamotors.com/api/1';

// --- Auth Management ---

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('tesla_access_token', token, { 
    secure: true, 
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('tesla_access_token')?.value;
}

export async function removeAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('tesla_access_token');
}

export async function hasAuthToken() {
  const token = await getAuthToken();
  return !!token;
}

// --- Tesla API Proxy ---

async function fetchTesla(endpoint: string, method: string = 'GET', body: any = null) {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error("No access token found. Please login.");
  }

  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'TeslaCommand/1.0'
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);

  if (response.status === 401) {
    await removeAuthToken();
    throw new Error("Unauthorized. Token may have expired.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tesla API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function fetchVehicleData(): Promise<VehicleData> {
  // 1. Get List of Vehicles
  const listResponse = await fetchTesla('/vehicles');
  if (!listResponse.response || listResponse.response.length === 0) {
    throw new Error("No vehicles found on this account.");
  }
  
  const vehicle = listResponse.response[0];
  const vehicleId = vehicle.id_s;

  // 2. Get Detailed Vehicle Data
  // Note: If the vehicle is asleep, this might fail or return limited data.
  // The frontend handles the "asleep" state by checking the `state` property.
  const dataResponse = await fetchTesla(`/vehicles/${vehicleId}/vehicle_data`);
  
  return dataResponse.response;
}

export async function wakeUpVehicle(vehicleId: number | string): Promise<boolean> {
  try {
    const response = await fetchTesla(`/vehicles/${vehicleId}/wake_up`, 'POST');
    return response.response.state === 'online' || response.response.state === 'waking';
  } catch (error) {
    console.error("Wake Up Error:", error);
    return false;
  }
}

export async function sendCommand(vehicleId: number | string, command: string, body: any = {}) {
  const response = await fetchTesla(`/vehicles/${vehicleId}/command/${command}`, 'POST', body);
  return response.response;
}