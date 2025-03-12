import { isemptygeom } from "./helpers/isemptygeom.js";

export function removeempty(x) {
  let data = JSON.parse(JSON.stringify(x));
  let features = [];
  data.features.forEach((d) => {
    if (!isemptygeom(d.geometry)) {
      features.push(d);
    }
  });

  data.features = features;

  return data;
}
