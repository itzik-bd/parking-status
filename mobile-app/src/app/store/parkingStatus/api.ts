import {ParkingSlot, RawParkingStatus, RawParkingSlot, ParkingStatus} from '../../../types';

const base64 = require('base-64');
const url = 'https://d1x1lhi56k7xsh.cloudfront.net';
const credentials = {
  username: 'user',
  password: 'password',
};

const fetchData = async (): Promise<ParkingStatus> => {
  const response = await fetch(`${url}/status.json`, {
    method: 'get',
    headers: {
      'Authorization': 'Basic ' + base64.encode(`${credentials.username}:${credentials.password}`),
    },
  });
  const jsonData: RawParkingStatus = (await response.json());
  const resSlots: ParkingSlot[] = jsonData.slots.reduce((res: ParkingSlot[], currRawSlot: RawParkingSlot, index: number) => {
    return [...res, {id: `${index}`, available: currRawSlot.available}];
  }, []);

  console.log(`** fetchData: ${resSlots.length} parking slots was fetched. last update: ${new Date(jsonData.lastUpdate).toLocaleString()}`);

  return {
    image: `${url}/${jsonData.image}`,
    lastUpdate: jsonData.lastUpdate,
    slots: resSlots,
  };
};

export const api = {fetchData};
