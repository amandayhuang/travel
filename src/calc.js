const PONG_SIMPLE = 2;
const PONG_SPECIAL = 4;
const KONG_SIMPLE = 8;
const KONG_SPECIAL = 16;
const CONCEALED_MULTIPLIER = 2;
const PAIR = 2;
const FLOWER_SEASON = 4;
const WINNER = 20;
const WINNER_EXTRAS = 2;

// const SIMPLE_SUITS = ["B", "C", "D"];
const SPECIAL_SUITS = ["N", "W"];
const SPECIAL_NUMS = ["1", "9"];

let line_items = [];
let line_items_doubled = [];
let times_doubled = 0;

export const calculateScore = (
  tiles,
  roundWind,
  myWind,
  winner,
  wall,
  shot,
  eyes
) => {
  const [tileHash, chows] = makeHash(tiles);
  const kongs = findSets(tileHash, 4);
  const pongs = findSets(tileHash, 3);
  const pairs = findSets(tileHash, 2);
  let score = addPoints(kongs, pongs, pairs, roundWind, myWind);

  if (tileHash["X_X"]) {
    score += tileHash["X_X"].num * FLOWER_SEASON;
    line_items.push([
      "Flower or Season (x" + tileHash["X_X"].num + ")",
      tileHash["X_X"].num * FLOWER_SEASON,
    ]);
  }

  if (winner) {
    score += WINNER;
    line_items.push(["Mahjong Winner", WINNER]);
    if (wall) {
      score += WINNER_EXTRAS;
      line_items.push(["Drawn From Wall", WINNER_EXTRAS]);
    }
    if (shot) {
      score += WINNER_EXTRAS;
      line_items.push(["One Shot", WINNER_EXTRAS]);
    }
    if (eyes) {
      score += WINNER_EXTRAS;
      line_items.push(["Fishing the Eyes", WINNER_EXTRAS]);
    }
  }

  // 2^times_doubled * base_score
  const scoreDoubled = Math.pow(2, times_doubled) * score;

  // console.log("***************************************");
  // console.log(line_items);
  // console.log("***************************************");

  const lineItems = line_items.concat(line_items_doubled);
  times_doubled = 0;
  line_items = [];
  line_items_doubled = [];

  return [scoreDoubled, lineItems];
};

const addPoints = (kongs, pongs, pairs, roundWind, myWind) => {
  let score = 0;
  score += calculatePoints(
    kongs,
    KONG_SIMPLE,
    KONG_SPECIAL,
    roundWind,
    myWind,
    "Kong"
  );
  score += calculatePoints(
    pongs,
    PONG_SIMPLE,
    PONG_SPECIAL,
    roundWind,
    myWind,
    "Pong"
  );
  score += calculatePoints(pairs, PAIR, null, roundWind, myWind, "Pair");
  return score;
};

const calculatePoints = (array, simple, special, roundWind, myWind, title) => {
  let points = 0;
  array.forEach((ele) => {
    let code = ele.code;
    code = ele.split("_");
    const suit = code[0];
    const type = code[1];
    const hidden = code[2];

    if (special === null) {
      if (suit === "N") {
        points += simple;
        line_items.push(["Pair of Dragons", simple]);
      }
      if (suit === "W" && type === roundWind) {
        points += simple;
        line_items.push(["Pair of Round Wind", simple]);
      }
      if (suit === "W" && type === myWind) {
        points += simple;
        line_items.push(["Pair of My Wind", simple]);
      }
    } else {
      if (suit === "N") {
        times_doubled += 1;
        line_items_doubled.push(["Doubled for Pong or Kong of Dragon", ""]);
      }
      if (suit === "W" && type === roundWind) {
        times_doubled += 1;
        line_items_doubled.push(["Doubled for Pong or Kong of Round Wind", ""]);
      }
      if (suit === "W" && type === myWind) {
        times_doubled += 1;
        line_items_doubled.push(["Doubled for Pong or Kong of My Wind", ""]);
      }

      if (SPECIAL_SUITS.includes(suit) || SPECIAL_NUMS.includes(type)) {
        if (hidden === "C") {
          points += special * CONCEALED_MULTIPLIER;
          line_items.push([
            `${title} of Terminal, Wind, or Dragon (Concealed)`,
            special * CONCEALED_MULTIPLIER,
          ]);
        } else {
          points += special;
          line_items.push([
            `${title} of Terminal, Wind, or Dragon (Exposed)`,
            special,
          ]);
        }
      } else {
        if (hidden === "C") {
          points += simple * CONCEALED_MULTIPLIER;
          line_items.push([
            `${title} of Simple 2-8 (Concealed)`,
            simple * CONCEALED_MULTIPLIER,
          ]);
        } else {
          points += simple;
          line_items.push([`${title} of Simple 2-8 (Exposed)`, simple]);
        }
      }
    }
  });
  return points;
};

const makeHash = (tiles) => {
  const hash = {};
  const chows = [];
  tiles.forEach((tile) => {
    let code = tile.code;
    const hidden = tile.hidden;
    const chow = tile.chow;

    if (chow === true) {
      code = "CHOW_" + code;
      chows.push(code);
    } else if (hash[code]) {
      hash[code].num += 1;
      if (hidden === true) {
        hash[code].num_hidden += 1;
      }
    } else {
      hash[code] = { num: 1 };
      if (hidden === true) {
        hash[code].num_hidden = 1;
      } else {
        hash[code].num_hidden = 0;
      }
    }
  });

  return [hash, chows];
};

const findSets = (tileHash, length) => {
  const sets = [];
  for (const key in tileHash) {
    const num = tileHash[key].num;
    const num_hidden = tileHash[key].num_hidden;
    const hidden = num === num_hidden ? "C" : "O";
    if (num === length && key !== "X_X") {
      const entry = `${key}_${hidden}`;
      sets.push(entry);
      delete tileHash[entry];
    }
  }
  return sets;
};
