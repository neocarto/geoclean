import { solveemptygeom } from "./solveemptygeom.js";

/**
 * Wrap a GeoJSON object in a FeatureCollection.
 * It accepts:
 * - a single Feature
 * - a single Geometry
 * - an array of Features
 * - an array of Geometries
 *
 * If the GeoJSON object is already a FeatureCollection, it is returned as-is.

 *
 * @param {object} x - The GeoJSON object(s) to wrap in a FeatureCollection
 * @returns {{features: [{geometry:{}, type: string, properties: {}}], type: string}}
 */
export function featurecollection(x) {
  let result;

  x = JSON.parse(JSON.stringify(x));
  // FeatureCollection
  if (x?.type == "FeatureCollection" && !Array.isArray(x)) {
    result = x;
  }

  // Features
  else if (
    Array.isArray(x) &&
    x[0]?.["type"] != undefined &&
    x[0]?.["properties"] != undefined &&
    x[0]?.["geometry"] != undefined
  ) {
    result = { type: "FeatureCollection", features: x };
  }
  // Array of geometries
  else if (
    Array.isArray(x) &&
    x[0]?.["type"] != undefined &&
    x[0]?.["coordinates"] != undefined
  ) {
    result = {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: d,
      })),
    };
  }
  // Single geometry
  else if (
    typeof x == "object" &&
    [
      "Point",
      "LineString",
      "Polygon",
      "MultiPoint",
      "MultiLineString",
      "MultiPolygon",
    ].includes(x?.type)
  ) {
    result = {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: x }],
    };
  }
  // Single feature
  else if (typeof x == "object" && x?.type == "Feature") {
    result = {
      type: "FeatureCollection",
      features: [x],
    };
  } else {
    result = undefined;
  }

  //return result;
  return solveemptygeom(result);
}
