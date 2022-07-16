/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
import * as d3 from "d3";
// import orderBy from "lodash/orderBy";

// eslint-disable-next-line import/extensions
import _ from "lodash"; // https://www.geeksforgeeks.org/lodash-_-orderby-method/
import { d3Array } from "./d3Article";
// eslint-disable-next-line import/extensions

const btnD3Category = document.getElementById( "btnD3Category") as HTMLButtonElement; // prettier-ignore

// eslint-disable-next-line import/no-mutable-exports
export let sortBy = "price";

export async function changeType() {
  let toggleType = "";
  if (sortBy !== "value") {
    sortBy = "value";
    toggleType = sortBy;
  }
  if (sortBy !== "price") {
    sortBy = "price";
    toggleType = sortBy;
  }
  return toggleType;
}

// eslint-disable-next-line no-shadow
async function lodashSortData(DATA: any[], sortBy: string) {
  let category = "";

  //  newSortType = sortType;
  // console.log({ newSortType: sortBy });
  switch (sortBy) {
    case "value": {
      category = "value";
      break;
    }
    case "price": {
      category = "price";
      break;
    }
    default: {
      category = "price";
    }
  }
  return _.orderBy(DATA, [category], ["desc"]);
}
export async function drawChart(DATA: any[], newSort: string) {
  if (!DATA) throw new Error("d3 not found");
  const cheerioData = await lodashSortData(DATA, newSort);

  // https://youtu.be/TOJ9yjvlapY
  const xScale = d3
    .scaleBand()
    .domain(cheerioData.map((dataPoint) => dataPoint.coin))
    .rangeRound([0, 250])
    .padding(0.1);

  const yScale = d3.scaleLinear().domain([0, 1000]).range([200, 0]);

  const d3Container = d3.select("#d3").classed("container-d3", true);

  // const d3Bars =...
  // eslint-disable-next-line no-unused-vars
  d3Container
    .selectAll(".bar")
    .data(cheerioData)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", xScale.bandwidth())
    .attr("height", (data) => 200 - yScale(data.value))
    .attr("x", (data) => xScale(data.coin) as number)
    .attr("y", (data) => yScale(data.value));
  // console.log("file: drawChart.ts | line 37 | drawChart | d3Bars", d3Bars);

  // setTimeout(() => {
  //   d3Bars.data(DUMMY_DATA.slice(0, 2)).exit().remove(); // exit opposite of enter & remove from DOM
  // }, 2000);
}

// ///////////////////////FETCH FEED FROM API////////////////////////////////
const feedDisplay = document.querySelector("#feed") as HTMLDivElement;
const url = "https://crytpoku.herokuapp.com/crypto";

// Add CORS Package in your backend server directory

export const dataFetch = fetch(url)
  .then((response) => response.json())
  .then((data) => {
    data.result.forEach((entry: any, index: number) => {
      // console.log(entry);
      if (index < 10) {
        const articleItem = `
        <div>
        <h3 id="coinTitle" class="title">
        <a href="https://www.google.com/search?q=${entry.Coin}">
              ${entry.Coin}
                </a>
                </h3>
                <div class="price">
                <button id="btnFetchPrice" class="m-0 px-2 py-1">${entry.Price}</button>
                </div>
                <div class="market-cap">
                <button id="btnFetchMarketCap" class="m-0 px-2 py-1">
                ${entry.Marketcap}
                </button>
                </div>
                <div class="day-7">
                <button id="btnFetch7Days" class="m-0 px-2 py-1">
                ${entry.Days_7}
                </button>
                </div>
                <div class="hours-7">
                <button id="btnFetch24Hours" class="m-0 px-2 py-1">
                ${entry.Hours_24}
                </button>
                </div>
                </div>
                `;
        feedDisplay.insertAdjacentHTML("beforeend", articleItem);

        (async () =>
          d3Array.push({
            id: (index + 1).toString(),
            price:
              parseFloat((await entry.Price).substring(1).replace(/,/, "")) *
              0.01,
            value: parseFloat(entry.Marketcap) * 100,
            coin: await entry.Coin,
          }))();
      }
    });
  })
  .catch((err) => console.error(err));

btnD3Category.addEventListener("click", async () => {
  const changeSort = await changeType();
  // console.log("click", sortBy);
  const res = await lodashSortData(d3Array, changeSort);
  await drawChart(res, changeSort);
});
