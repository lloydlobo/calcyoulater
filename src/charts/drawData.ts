/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { btnD3Category, d3Label } from "../main";
import { d3Array } from "./d3Article";
import { changeType, dataFetch, drawChart, sortBy } from "./drawChart";

export function drawData() {
  (async () => {
    await dataFetch; // use this to wait till the data is fetched // and then draw d3 chart when d3Array is populated in the stack/heap?  // FIXME
    let awaitSort = sortBy;
    awaitSort = await changeType();

    btnD3Category.addEventListener("click", async () => {
      // eslint-disable-next-line no-import-assign
      awaitSort = await changeType();
      await drawChart(d3Array, awaitSort); // uses a global variable
    });

    await drawChart(d3Array, sortBy); // uses a global variable

    if (!d3Label) throw new Error("d3 not found");
    d3Label.textContent = "Market Cap";
    btnD3Category.textContent = `Sort by ${await changeType()}`;
    btnD3Category.style.padding = "1ch 2ch";
  })();
}
