import { create } from 'zustand';
import { TUser } from '../typing';

type TAuthState = {
  user: TUser | undefined;
  setUser: (user: TUser | undefined) => void;
};

const useAuthStore = create<TAuthState>((set, get) => ({
  user: undefined,
  setUser: (user: TUser | undefined) => set(() => ({ user })),
}));

export default useAuthStore;
