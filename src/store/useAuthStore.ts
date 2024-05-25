import { create } from 'zustand';

type TAuthState = {
  user: TUser | undefined;
  setUser: (user: TUser | undefined) => void;
  addNewSafe: (safe: TSafe | undefined) => void;
  updateSafe: (safe: TSafe) => void;
  deleteSafes: ({ safeIdList }: TSafeIdList) => void;
  updateUser: ({ lifeCheck, fieldToUpdate }: TUserUpdate) => void;
  setContacList: ({
    contactList,
    safeId,
    type,
  }: {
    contactList: TContactInfo[];
    safeId: string;
    type: 'emails' | 'phones';
  }) => void;
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
          return !safeIdList.includes(currSafe._id);
        });
        return { user: { ...state.user, safes: updatedList } };
      }
      return { ...state.user };
    }),
  updateUser: ({ lifeCheck, fieldToUpdate }) =>
    set((state) => {
      if (state.user && state.user.safes) {
        let value;
        if (fieldToUpdate === 'lifeCheck') value = lifeCheck;
        return { user: { ...state.user, [fieldToUpdate]: value } };
      }
      return { ...state.user };
    }),
  setContacList: ({ contactList, safeId, type }) =>
    set((state) => {
      if (!state.user || !state.user.safes) return { ...state.user };

      const updatedList = state.user.safes.map((currSafe) => {
        if (currSafe._id === safeId) {
          return { ...currSafe, ...{ [type]: { contactList } } };
        }
        return { ...currSafe };
      });
      return { user: { ...state.user, safes: updatedList } };
    }),
}));

export default useAuthStore;
``;
