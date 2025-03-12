import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom, geosGeomToGeojson } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/isemptygeom.js";

/**
 * This function attempts to create a valid representation of a given invalid geometry without losing any of the input vertices. This is an implementation of the GEOSMakeValid function in the `geos-wasm` library. It returns a geoJSON which is valid according to the GEOS validity rules, and preserves as much as possible of the input geometry's extent, dimension, and structure.
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 *
 */
export async function makevalid(x) {
  const geos = await initGeosJs();

  let data = JSON.parse(JSON.stringify(x));

  data.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      d.geometry = undefined;
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      const validity = geos.GEOSisValidReason(geosGeom);

      if (validity != "Valid Geometry") {
        const newGeom = geos.GEOSMakeValid(geosGeom);
        d.geometry = geosGeomToGeojson(newGeom, geos);
        geos.GEOSFree(geosGeom);
        geos.GEOSFree(newGeom);
      }
    }
  });

  return data;
}
