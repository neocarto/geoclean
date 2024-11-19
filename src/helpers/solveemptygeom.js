import { implantation } from "./implantation.js";

/**
 * This function tries to solve features with empty geometries
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 *
 */
export function solveemptygeom(x, defaultype = "Point") {
  //x = featurecollection(x);

  let type;
  switch (implantation(x)) {
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

  let result = [];
  x.features.forEach((d) => {
    if (
      d?.geometry == undefined ||
      ![
        "Point",
        "LineString",
        "Polygon",
        "MultiPoint",
        "MultiLineString",
        "MultiPolygon",
      ].includes(d?.geometry?.type) ||
      d?.geometry?.coordinates == undefined ||
      d?.geometry?.coordinates?.length == 0
    ) {
      d.geometry = { type: type, coordinates: [] };
    }
  });

  return x;
}
