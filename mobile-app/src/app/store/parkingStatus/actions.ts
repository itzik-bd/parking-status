import {parkingStatusStore} from './store';
import {api} from './api';

export const fetchData = async (): Promise<void> => {
  const data = await api.fetchData();
  parkingStatusStore.setters.slots(data.slots);
  parkingStatusStore.setters.image(data.image);
  parkingStatusStore.setters.isInit(true);
};

export const fetchDataIfNeeded = async (): Promise<void> => {
  if (!parkingStatusStore.getters.isInit()) {
    try {
      await fetchData();
    }
    catch(err) {
      parkingStatusStore.setters.isInit(false);
      console.error('parkingSlotsActions:', err);
    }
  }
};
