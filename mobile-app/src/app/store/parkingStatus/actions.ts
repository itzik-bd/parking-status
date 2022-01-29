import {parkingStatusStore} from './store';
import {ParkingSlot, RawParkingSlot, RawParkingStatus, WebSocketData} from '../../../types';
import {_environment} from '../../environment';

const onOpen = () => {
  console.debug('WebSocket connected');
};

const onClose = (event: WebSocketCloseEvent) => {
  console.debug('WebSocket disconnected', event);
};

const onError = (event: WebSocketErrorEvent) => {
  console.debug('WebSocket error', event);
};

const serializeSlots = (slots: RawParkingSlot[]): ParkingSlot[] => {
  return slots.reduce((res: ParkingSlot[], currRawSlot: RawParkingSlot, index: number) => {
    return [...res, {id: `${index}`, available: currRawSlot.available}];
  }, []);
};

const onMessageReceived = (event: WebSocketMessageEvent) => {
  console.debug('WebSocket onMessageReceived', event);
  const data: WebSocketData = JSON.parse(event.data);
  const messageType = data.type;
  switch (messageType) {
    case 'loading': {
      parkingStatusStore.setters.messageStatus('loading');
      break;
    }
    case 'update': {
      const castedData = data as RawParkingStatus;
      const imgUrl = `http://${_environment.state.host}/${castedData.image}`;
      parkingStatusStore.setters.slots(serializeSlots(castedData.slots));
      parkingStatusStore.setters.image({uri: imgUrl});
      parkingStatusStore.setters.messageStatus('update');
      parkingStatusStore.setters.isInit(true);
      break;
    }
    default : {
      console.warn('WebSocket discarding unknown message', data);
      break;
    }
  }
};

const createNewWebSocket = (): WebSocket => {
  const _socket = new WebSocket(_environment.state.ws);
  _socket.onopen = onOpen;
  _socket.onclose = onClose;
  _socket.onerror = onError;
  _socket.onmessage = onMessageReceived;
  return _socket;
};

export const createWebSocketIfNeeded = (): void => {
  if (!parkingStatusStore.getters.socket()) {
    parkingStatusStore.setters.socket(createNewWebSocket());
  }
};

export const refreshWebsocket = (): void => {
  parkingStatusStore.getters.socket()?.close();
  parkingStatusStore.setters.socket(createNewWebSocket());
};

export const clearWebSocket = (): void => {
  parkingStatusStore.getters.socket()?.close();
  parkingStatusStore.setters.socket(null);
};

export const clearState = (): void => {
  parkingStatusStore.setters.messageStatus(null);
  parkingStatusStore.setters.isInit(false);
  parkingStatusStore.setters.slots([]);
  parkingStatusStore.setters.image({});
  parkingStatusStore.getters.socket()?.close();
  parkingStatusStore.setters.socket(null);
};
