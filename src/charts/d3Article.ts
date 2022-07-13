// eslint-disable-next-line import/no-unresolved, import/extensions
import { dataFetch, drawChart, sortBy } from "./drawChart";

// ///////////////////////CHARTS D3//////////////////////////////////////////
const d3Article = document.getElementById("d3");
const d3Label = document.getElementById("d3Label") as HTMLLabelElement;
if (!d3Article) throw new Error("d3 not found");
// eslint-disable-next-line import/prefer-default-export
export const d3Array: any[] = [];
(async () => {
  await dataFetch; // use this to wait till the data is fetched // and then draw d3 chart when d3Array is populated in the stack/heap?  // FIXME
  await drawChart(d3Array, sortBy); // uses a global variable
  if (!d3Label) throw new Error("d3 not found");
  d3Label.textContent = "Market Cap";
})();
