import { implantation } from "./helpers/implantation.js";
import { isemptygeom } from "./helpers/isemptygeom.js";


export function resolveempty(x, defaultype = "Point") {
  let data = JSON.parse(JSON.stringify(x));

  let type;
  switch (implantation(data)) {
    case 1:
      type = "Point";
      break;
    case 2:
      type = "LineString";
      break;
    case 3:
      type = "Polygon";
      break;
    default:
      type = defaultype;
  }

  data.features.map(
    (d) => (d.geom = isemptygeom ? { type: type, coordinates: [] } : d.geom)
  );

  return data;
}
