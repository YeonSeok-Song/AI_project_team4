import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const aiAtom = atom({
  key: 'userIsHear',
  default: true,
  effects_UNSTABLE: [persistAtom],
});

export const readyAtom = atom({
  key: 'getReady',
  default: false,
});
