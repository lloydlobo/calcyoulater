export function flattenDataMapCache(mappedData: Map<number, string | number>) {
  const arrData: (string | number)[] = [];
  const data: Map<number, string | number> = mappedData;
  for (let i = 1; i <= data.size; i += 1) {
    const currData = data.get(i);
    // eslint-disable-next-line no-console
    console.log({ currData });
    // eslint-disable-next-line no-alert
    if (typeof currData === "undefined") throw new Error();
    arrData.push(currData);
  } // end of for loop
  if (!arrData.filter((item) => (typeof item === "undefined") as boolean))
    throw new Error("arrData has an undefined item"); // prettier-ignore

  return { data, arrData };
}
