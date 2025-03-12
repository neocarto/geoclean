import initGeosJs from "geos-wasm";
import { geojsonToGeosGeom } from "geos-wasm/helpers";
import { isemptygeom } from "./helpers/isemptygeom";

/**
 * This function tests the validity of the geometry. This is an implementation of the GEOSisValid function in the `geos-wasm` library.  It returns an array of strings.
 *
 * @param {object|array} x - The targeted FeatureCollection / Features / Geometries
 *
 */
export async function isvalid(x) {
  const geos = await initGeosJs();

  let result = [];
  x.features.forEach((d) => {
    if (isemptygeom(d?.geometry)) {
      result.push(undefined);
    } else {
      const geosGeom = geojsonToGeosGeom(d, geos);
      result.push({
        validity: geos.GEOSisValidReason(geosGeom),
        empty: geos.GEOSisEmpty(geosGeom),
        simple: geos.GEOSisSimple(geosGeom),
        ring: geos.GEOSisRing(geosGeom),
        closed: geos.GEOSisClosed(geosGeom),
      });
      geos.GEOSFree(geosGeom);
    }
  });
  return result;
}
