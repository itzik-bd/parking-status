import {ParkingSlot} from '../../../types';

const data: ParkingSlot[] = [
  {
    id: '1',
    available: true,
  },
  {
    id: '2',
    available: false,
  },
  {
    id: '3',
    available: true,
  },
  {
    id: '4',
    available: false,
  },
  {
    id: '5',
    available: false,
  },
  {
    id: '6',
    available: true,
  },
];

const fetchData = async (): Promise<ParkingSlot[]> => {
  return Promise.resolve([...data]);
};

export const api = {fetchData};
