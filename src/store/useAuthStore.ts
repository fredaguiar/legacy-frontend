import { create } from 'zustand';

type TAuthState = {
  user: TUser | undefined;
  setUser: (user: TUser | undefined) => void;
  addNewSafe: (safe: TSafe | undefined) => void;
  updateSafe: (safe: TSafe) => void;
  deleteSafes: ({ safeIdList }: TSafeIdList) => void;
  updateUser: ({ lifeCheck, fieldsToUpdate }: TUserUpdate) => void;
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
  updateSafe: (safeUpdated: TSafe) =>
    set((state) => {
      if (state.user && state.user.safes) {
        const updatedList = state.user.safes.map((currSafe) => {
          if (currSafe._id === safeUpdated._id) {
            return { ...currSafe, ...safeUpdated };
          }
          return { ...currSafe };
        });
        return { user: { ...state.user, safes: updatedList } };
      }
      return { ...state.user };
    }),
  deleteSafes: ({ safeIdList }: TSafeIdList) =>
    set((state) => {
      if (state.user && state.user.safes) {
        const updatedList = state.user.safes.filter((currSafe) => {
          return !safeIdList.includes(currSafe._id || '');
        });
        return { user: { ...state.user, safes: updatedList } };
      }
      return { ...state.user };
    }),
  updateUser: ({ lifeCheck, fieldsToUpdate }) =>
    set((state) => {
      if (state.user && state.user.safes) {
        let value;
        if (fieldsToUpdate[0] === 'lifeCheck') value = lifeCheck;
        return { user: { ...state.user, [fieldsToUpdate[0]]: value } };
      }
      return { ...state.user };
    }),
}));

export default useAuthStore;
``;
