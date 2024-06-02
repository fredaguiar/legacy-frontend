type TLabelsValues = { label: string; value: string };

const getMap = (contant: TLabelsValues[]) => {
  const map = new Map();
  contant.forEach((item) => {
    map.set(item.value, item.label);
  });
  return map;
};

const MapsUtil = {
  getMap,
};

export { MapsUtil };
