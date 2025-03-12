import { feature } from "topojson-client";
const topojson = Object.assign({}, { feature });
import { table2geo } from "./helpers/table2geo";

export function featurecollection(
  input,
  {
    lat = undefined,
    lon = undefined,
    coords = undefined,
    reverse = false,
    properties = undefined,
  } = {}
) {
  let x = JSON.parse(JSON.stringify(input));
  if (isFeatureCollection(x)) {
    return x;
  } else if (isTopology(x)) {
    console.log("TOPO");
    x = topojson.feature(x, Object.keys(x.objects)[0]);
  } else if (isFeatures(x)) {
    x = { type: "Feature", features: x };
  } else if (isFeature(x)) {
    x = { type: "Feature", features: [x] };
  } else if (isGeometries(x)) {
    x = {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: d,
      })),
    };
  } else if (isGeometry(x)) {
    x = {
      type: "Feature",
      features: [{ type: "Feature", properties: {}, geometry: x }],
    };
  } else if (isArrayOfObjects(x)) {
    x = table2geo(x, lat, lon, coords, reverse);
  } else if (isArrayOfCoords(x)) {
    x = {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: reverse
            ? [parseFloat(d[1]), parseFloat(d[0])]
            : [parseFloat(d[0]), parseFloat(d[1])],
        },
      })),
    };
  } else if (isTwoValues(x)) {
    x = {
      type: "FeatureCollection",
      fetaures: [
        {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: x },
        },
      ],
    };
  }

  // Select properties

  if (properties != undefined && Array.isArray(properties)) {
    x.features.forEach((d) => {
      d.properties = Object.fromEntries(
        properties.map((k) => [k, d?.properties[k]])
      );
    });
  }

  // Output
  return x;
}

// Helpers

function isFeatureCollection(x) {
  if (
    !Array.isArray(x) &&
    x?.type == "FeatureCollection" &&
    Array.isArray(x?.features) &&
    x?.features[0]?.hasOwnProperty("type") &&
    x?.features[0]?.hasOwnProperty("properties") &&
    x?.features[0]?.hasOwnProperty("geometry")
  ) {
    return true;
  } else {
    return false;
  }
}

function isTopology(x) {
  if (x?.type == "Topology" && !Array.isArray(x)) {
    return true;
  } else {
    return false;
  }
}

function isFeatures(x) {
  if (
    Array.isArray(x) &&
    x.length > 0 &&
    x[0]?.hasOwnProperty("type") &&
    x[0]?.hasOwnProperty("properties") &&
    x[0]?.hasOwnProperty("geometry")
  ) {
    return true;
  } else {
    return false;
  }
}

function isFeature(x) {
  if (
    typeof x === "object" &&
    !Array.isArray(x) &&
    x !== null &&
    x?.hasOwnProperty("type") &&
    x?.hasOwnProperty("properties") &&
    x?.hasOwnProperty("geometry")
  ) {
    return true;
  } else {
    return false;
  }
}

function isGeometries(x) {
  if (
    Array.isArray(x) &&
    x.length > 0 &&
    x[0]?.hasOwnProperty("type") &&
    x[0]?.hasOwnProperty("coordinates")
  ) {
    return true;
  } else {
    return false;
  }
}

function isGeometry(x) {
  if (
    typeof x === "object" &&
    !Array.isArray(x) &&
    x !== null &&
    x?.hasOwnProperty("type") &&
    x?.hasOwnProperty("coordinates")
  ) {
    return true;
  } else {
    return false;
  }
}

function isArrayOfObjects(x) {
  if (
    Array.isArray(x) &&
    !Array.isArray(x[0]) &&
    x.length > 0 &&
    typeof x[0] === "object"
  ) {
    return true;
  } else {
    return false;
  }
}

function isArrayOfCoords(x) {
  if (
    Array.isArray(x) &&
    x[0].length == 2 &&
    Array.isArray(x[0]) &&
    typeof x[0][0] !== "object" &&
    typeof x[0][1] !== "object"
  ) {
    return true;
  } else {
    return false;
  }
}

function isTwoValues(x) {
  if (Array.isArray(x) && x.length == 2 && isNumber(x[0]) && isNumber(x[1])) {
    return true;
  } else {
    return false;
  }
}

function isNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    typeof value !== "boolean" &&
    isFinite(value)
  );
}
