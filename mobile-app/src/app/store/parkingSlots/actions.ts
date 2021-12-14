import {parkingSlotsStore} from './store';
import {api} from './api';

export const fetchData = async (): Promise<void> => {
  const data = await api.fetchData();
  parkingSlotsStore.setters.slots(data);
};

export const fetchDataIfNeeded = async (): Promise<void> => {
  if (!parkingSlotsStore.getters.isInit()) {
    parkingSlotsStore.setters.isInit(true);

    try {
      await fetchData();
    }
    catch(err) {
      parkingSlotsStore.setters.isInit(false);
      console.error('parkingSlotsActions:', err);
    }
  }
};
