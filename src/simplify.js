import { topology } from "topojson-server";
import { feature, quantize as quantiz } from "topojson-client";
import { presimplify, quantile, simplify as simple } from "topojson-simplify";

const topojson = Object.assign(
  {},
  { topology, presimplify, quantiz, quantile, simple, feature }
);

// ajouter param mutate = false

export function simplify(
  x,
  { k = undefined, quantize = undefined, arcs = 15000 } = {}
) {
  let data = JSON.parse(JSON.stringify(x));

  let topo = topojson.topology({ foo: data });
  let simpl = topojson.presimplify(topo);

  if (k == undefined) {
    k = arcs / simpl.arcs.flat().length;
    k = k > 1 ? 1 : k;
  }

  simpl = topojson.simple(simpl, topojson.quantile(simpl, k));
  if (quantize) {
    console.log("quantize");
    simpl = topojson.quantiz(simpl, quantize);
  }

  data.features = topojson.feature(
    simpl,
    Object.keys(simpl.objects)[0]
  ).features;
  return data;
}
