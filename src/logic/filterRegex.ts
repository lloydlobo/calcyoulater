import { REGEX } from "../main";
import { itemExists } from "../utils/itemExists";

export function filterRegex(strJoinArrData: string) {
  const arrNumbers = strJoinArrData
    .replace(REGEX.regexIsOperator, " ")
    .split(" ");

  const arrOperator = strJoinArrData
    .replace(REGEX.regexIsNumber, " ")
    .split(" ")
    .filter((item) => itemExists(item));

  return { arrNumbers, arrOperator };
}
