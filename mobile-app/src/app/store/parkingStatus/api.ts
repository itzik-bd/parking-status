import {ParkingSlot, RawParkingStatus, RawParkingSlot, ParkingStatus} from '../../../types';
import {ImageURISource} from 'react-native';

const base64 = require('base-64');
const url = 'https://d1x1lhi56k7xsh.cloudfront.net';
const credentials = {
  username: 'user',
  password: 'password',
};

const authorizationHeader = {
  'Authorization': 'Basic ' + base64.encode(`${credentials.username}:${credentials.password}`),
};

const fetchData = async (): Promise<ParkingStatus> => {
  const response = await fetch(`${url}/status.json`, {
    method: 'get',
    headers: {
      ...authorizationHeader,
    },
  });
  const jsonData: RawParkingStatus = await response.json();
  const resSlots: ParkingSlot[] = jsonData.slots.reduce((res: ParkingSlot[], currRawSlot: RawParkingSlot, index: number) => {
    return [...res, {id: `${index}`, available: currRawSlot.available}];
  }, []);
  const imageSource: ImageURISource = {
    uri: `${url}/${jsonData.image}`,
    headers: {
      ...authorizationHeader,
    },
  };

  console.log(`** fetchData: ${resSlots.length} parking slots was fetched. last update: ${new Date(jsonData.lastUpdate).toLocaleString()}`);

  return {
    image: imageSource,
    lastUpdate: jsonData.lastUpdate,
    slots: resSlots,
  };
};

export const api = {fetchData};
