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

const get1DayPeriod = () => {
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
    let beginOfPeriod = beginOfToday.setDate(beginOfToday.getDate() - 1);
    let endOfPeriod = endOfToday.setDate(endOfToday.getDate() - 1);

    beginOfPeriod = Math.floor(beginOfPeriod / 1000);
    endOfPeriod = Math.floor(endOfPeriod / 1000);

    return { begin: beginOfPeriod, end: endOfPeriod };
  } catch {
    return { begin: null, end: null };
  }
};

const get7DaysPeriod = () => {
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
    let beginOfPeriod = beginOfToday.setDate(beginOfToday.getDate() - 7);
    let endOfPeriod = endOfToday.setDate(endOfToday.getDate() - 1);

    beginOfPeriod = Math.floor(beginOfPeriod / 1000);
    endOfPeriod = Math.floor(endOfPeriod / 1000);

    return { begin: beginOfPeriod, end: endOfPeriod };
  } catch {
    return { begin: null, end: null };
  }
};

const get30DaysPeriod = () => {
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
    let beginOfPeriod = beginOfToday.setDate(beginOfToday.getDate() - 30);
    let endOfPeriod = endOfToday.setDate(endOfToday.getDate() - 1);

    beginOfPeriod = Math.floor(beginOfPeriod / 1000);
    endOfPeriod = Math.floor(endOfPeriod / 1000);

    return { begin: beginOfPeriod, end: endOfPeriod };
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

const utils = {
  fa2enDigits,
  getLocale,
  get1DayPeriod,
  get7DaysPeriod,
  get30DaysPeriod,
  crypt,
  decrypt,
};

module.exports = utils;
