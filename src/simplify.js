import { topology } from "topojson-server";
import { feature } from "topojson-client";
import { presimplify, quantile, simplify as simple } from "topojson-simplify";

const topojson = Object.assign(
  {},
  { topology, presimplify, quantile, simple, feature }
);

// ajouter param mutate = false

export function simplify(x, { k = undefined, arcs = 15000 } = {}) {
  let data = JSON.parse(JSON.stringify(x));

  let topo = topojson.topology({ foo: data });
  let simpl = topojson.presimplify(topo);

  if (k == undefined) {
    k = arcs / simpl.arcs.flat().length;
    k = k > 1 ? 1 : k;
  }

  const v1 = simpl.arcs.flat().length;
  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  const v2 = simpl.arcs.flat().length;
  data.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  console.log([k, v1, v2, v2 / v1]);
  return data;
}
