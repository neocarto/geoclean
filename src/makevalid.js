import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { featurecollection } from "./helpers/featurecollection.js";

/**
 * This function attempts to create a valid representation of a given invalid geometry without losing any of the input vertices. This is an implementation of the GEOSMakeValid function in the `geos-wasm` library. It returns a geoJSON which is valid according to the GEOS validity rules, and preserves as much as possible of the input geometry's extent, dimension, and structure.
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 *
 */
export async function makevalid(x) {
  const geos = await initGeosJs();
  x = featurecollection(x);
  const geosGeom = geojsonToGeosGeom(x, geos);
  const newGeom = geos.GEOSMakeValid(geosGeom);
  const validgeom = geosGeomToGeojson(newGeom, geos).geometries;
  x.features.forEach((d, i) => (d.geometry = validgeom[i]));
  geos.GEOSFree(geosGeom);
  geos.GEOSFree(newGeom);
  geos.GEOSFree(validgeom);
  return x;
}
