import { topology } from "topojson-server";
import { feature } from "topojson-client";
import { presimplify, quantile, simplify as simple } from "topojson-simplify";

const topojson = Object.assign(
  {},
  { topology, presimplify, quantile, simple, feature }
);

// ajouter param mutate = false

export function simplify(x, { k = 0.5 } = {}) {
  let data = JSON.parse(JSON.stringify(x));
  // simplification
  let topo = topojson.topology({ foo: data });
  let simpl = topojson.presimplify(topo);
  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  data.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  return data;
}
