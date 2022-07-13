import * as d3 from "d3";
import { d3Array } from "./main";

export async function drawChart(DUMMY_DATA: any[]) {
  console.log(await DUMMY_DATA[9]);
  if (!DUMMY_DATA) throw new Error("d3 not found");
  // https://youtu.be/TOJ9yjvlapY
  const xScale = d3
    .scaleBand()
    .domain(DUMMY_DATA.map((dataPoint) => dataPoint.coin))
    .rangeRound([0, 250])
    .padding(0.1);
  const yScale = d3.scaleLinear().domain([0, 1000]).range([200, 0]);

  const d3Container = d3.select("#d3").classed("container-d3", true);

  const d3Bars = d3Container
    .selectAll(".bar")
    .data(DUMMY_DATA)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", xScale.bandwidth())
    .attr("height", (data) => 200 - yScale(data.value))
    .attr("x", (data) => xScale(data.coin) as number)
    .attr("y", (data) => yScale(data.value));
  console.log(d3Bars);
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
