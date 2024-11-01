require("dotenv").config();
const LOCALES = require("../types/locales");
const fa_IR = require("../types/locales/fa-IR");

const fa2enDigits = (num) => {
  if (num === null || num === undefined) {
    return null;
  }

  if (typeof num !== "string" || num.length === 0) {
    return num.toString();
  }

  let faDigits = "۰۱۲۳۴۵۶۷۸۹";
  let arDigits = "٠١٢٣٤٥٦٧٨٩";
  let output = "";

  for (let ipos = 0; ipos < num.length; ipos++) {
    let faIndex = faDigits.indexOf(num[ipos]);

    if (faIndex >= 0) {
      output += faIndex.toString();
      continue;
    }

    let arIndex = arDigits.indexOf(num[ipos]);

    if (arIndex >= 0) {
      output += arIndex.toString();
      continue;
    }

    output += num[ipos];
  }

  return output.replace(/,/g, "");
};

const getLocale = () => {
  const locale = process.env.LOCALE || "fa_IR";

  switch (locale) {
    case LOCALES.FA_IR:
      return fa_IR;
    default:
      return fa_IR;
  }
};

const getYesterday = () => {
  try {
    let today = new Date();
    let beginOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    let endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    // let beginOfYesterday = beginOfToday.setDate(beginOfToday.getDate() - 1);
    let beginOfYesterday = beginOfToday.setDate(beginOfToday.getDate() - 30);
    // let endOfYesterday = endOfToday.setDate(endOfToday.getDate() - 1);
    let endOfYesterday = endOfToday.setDate(endOfToday.getDate());
    beginOfYesterday = Math.floor(beginOfYesterday / 1000);
    endOfYesterday = Math.floor(endOfYesterday / 1000);

    return { begin: beginOfYesterday, end: endOfYesterday };
  } catch {
    return { begin: null, end: null };
  }
};

const crypt = (salt, text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};

module.exports = { fa2enDigits, getLocale, getYesterday, crypt, decrypt };
