import { create } from 'zustand';
import { TSafe, TUser } from '../typing';

type TAuthState = {
  user: TUser | undefined;
  setUser: (user: TUser | undefined) => void;
  addNewSafe: (safe: TSafe | undefined) => void;
};

const useAuthStore = create<TAuthState>((set, get) => ({
  user: undefined,
  setUser: (user: TUser | undefined) => set(() => ({ user: user })),
  addNewSafe: (newSafe: TSafe | undefined) =>
    set((state) => {
      if (newSafe && state.user && state.user.safes) {
        const updatedList = [...state.user.safes, newSafe];
        return { user: { ...state.user, safes: updatedList } };
      }
      return { ...state.user };
    }),
}));

// { ...currUser, safes: [...currUser.safes, ...[data.createSafe]] }
//{ ...state.user, safes: [...state.user.safes, ...[safe]] }

export default useAuthStore;
