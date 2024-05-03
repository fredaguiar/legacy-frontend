const getSafe = (user?: TUser | null, safeId?: string | null) => {
  if (!user || !safeId) return null;
  return user?.safes.filter((curr) => safeId === curr._id)[0];
};

const SafeUtil = {
  getSafe,
};

export { SafeUtil };
