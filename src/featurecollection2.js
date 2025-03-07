// https://observablehq.com/d/bcc2b7f3770cd289

export function featurecollection2(
  input,
  { lat = undefined, lon = undefined, coords = undefined, reverse = false } = {}
) {
  let x = JSON.parse(JSON.stringify(input));
  if (isFeatureCollection(x)) {
    console.log("isFeatureCollection");
    return x;
  } else if (isFeatures(x)) {
    console.log("isFeatures");
    return { type: "Feature", features: x };
  } else if (isFeature(x)) {
    console.log("isFeature");
    return { type: "Feature", features: [x] };
  } else if (isGeometries(x)) {
    console.log("isGeometries");
    return {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: d,
      })),
    };
  } else if (isGeometry(x)) {
    console.log("isGeometry");
    return {
      type: "Feature",
      features: [{ type: "Feature", properties: {}, geometry: x }],
    };
  } else if (isArrayOfObjects(x)) {
    let coord1;
    if (lon == undefined) {
      const longitude = [
        "longitude",
        "Longitude",
        "Lon",
        "lon",
        "Lng",
        "lng",
        "long",
        "Long",
      ];
      coord1 =
        longitude[longitude.map((d) => x[0].hasOwnProperty(d)).indexOf(true)];
    } else {
      coord1 = lon;
    }

    let coord2;
    if (lat == undefined) {
      const latitude = ["latitude", "Latitude", "Lat", "lat"];
      coord2 =
        latitude[latitude.map((d) => x[0].hasOwnProperty(d)).indexOf(true)];
    } else {
      coord2 = lat;
    }

    return {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(d[coord1]), parseFloat(d[coord2])],
        },
      })),
    };
  } else {
    console.log("xxx");
    return "xx";
  }
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
  if (Array.isArray(x) && x.length > 0 && typeof x[0] === "object") {
    return true;
  } else {
    return false;
  }
}
