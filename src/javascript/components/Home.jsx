import { Box, Grid, Button, Chip } from "@material-ui/core";
import React, { useState } from "react";
import tiles from "../constants/tiles";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import IsolatedMenu from "./Menu";
import Check from "./Checkbox";
import Dropdown from "./Dropdown";
import LineItemDialog from "./LineItemDialog";
import { calculateScore } from "../../calc";

const Home = () => {
  const [myTiles, setMyTiles] = useState([]);
  const [score, setScore] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultVals = {
    roundWind: "",
    myWind: "",
    winner: false,
    wall: false,
    shot: false,
    eyes: false,
  };

  const windOptions = [
    ["N", "North"],
    ["E", "East"],
    ["S", "South"],
    ["W", "West"],
  ];

  const [vals, setVals] = useState(defaultVals);
  const [open, setOpen] = useState(false);

  const sortTiles = (tiles) => {
    const newTiles = tiles.slice().sort((a, b) => {
      if (a.code === b.code) {
        return a.dtAdded < b.dtAdded ? -1 : a.dtAdded > b.dtAdded ? 1 : 0;
      } else {
        return a.code < b.code ? -1 : 1;
      }
    });
    return newTiles;
  };

  const sortedTiles = sortTiles(myTiles);

  const clickHandler = (code) => {
    const newMyTiles = [
      ...sortedTiles,
      { code, hidden: false, dtAdded: new Date(), chow: false },
    ];
    setMyTiles(newMyTiles);
  };

  const clearHandler = () => {
    setMyTiles([]);
    setScore(null);
    setVals(defaultVals);
  };

  const scoreHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { roundWind, myWind, winner, wall, shot, eyes } = vals;
    // let ip = ''

    // try {
    //   const response = await axios.get('https://icanhazip.com/')
    //   ip = response.data
    // } catch (error) {
    //   ip = ''
    // }

    // const score = await axios.post('/api/v1/scores', {
    //   score: {
    //     tiles: JSON.stringify(sortedTiles),
    //     roundWind,
    //     myWind,
    //     winner,
    //     wall,
    //     shot,
    //     eyes,
    //     ip,
    //   },
    // })
    // setScore(score.data.value)
    // setLineItems(score.data.line_items)

    const [returnScore, items] = calculateScore(
      sortedTiles,
      roundWind,
      myWind,
      winner,
      wall,
      shot,
      eyes
    );
    // console.log("SCORING", vals, sortedTiles);
    // console.log("RESULT", returnScore, items);
    setScore(returnScore);
    setLineItems(items);
    setLoading(false);
  };

  const removeHandler = (idx) => {
    sortedTiles.splice(idx, 1);
    setMyTiles(sortedTiles);
  };

  const changeHandler = (event, name) => {
    const val =
      event.target.checked !== undefined
        ? event.target.checked
        : event.target.value;
    const newVals = { ...vals, [name]: val };
    setVals(newVals);
  };

  return (
    <div className="outer">
      <div className="inner">
        <h1>Mahjong Score Calculator</h1>
        <p className="section">My Tiles</p>
        {myTiles.length > 0 && (
          <p className="sub">Tap to mark as concealed or part of a chow.</p>
        )}
        <Box>
          <form onSubmit={(e) => scoreHandler(e)}>
            <Grid container>
              {sortedTiles.map((tile, idx) => {
                const hiddenText = tile.hidden ? "Unmark" : "Mark";
                const chowText = tile.chow ? "Unmark" : "Mark";
                return (
                  <Grid item xs={4} key={idx}>
                    <IsolatedMenu
                      idx={idx}
                      icon={tiles[tile.code].icon}
                      sortedTiles={sortedTiles}
                      setMyTiles={setMyTiles}
                      hiddenText={hiddenText}
                      chowText={chowText}
                      removeHandler={removeHandler}
                      hidden={tile.hidden}
                      chow={tile.chow}
                    />
                    <Box height="20px" />
                  </Grid>
                );
              })}
            </Grid>
            <Box display="flex">
              <Dropdown
                changeHandler={changeHandler}
                vals={vals}
                name="roundWind"
                label="Round Wind"
                options={windOptions}
              />
              <Dropdown
                changeHandler={changeHandler}
                vals={vals}
                name="myWind"
                label="My Wind"
                options={windOptions}
              />
            </Box>
            <Box displaye="flex" flexDirection="column">
              <Check
                changeHandler={changeHandler}
                vals={vals}
                name="winner"
                label="Mahjong Winner"
              />
              {vals.winner && (
                <>
                  <Check
                    changeHandler={changeHandler}
                    vals={vals}
                    name="wall"
                    label="Drawn From Wall"
                  />
                  <Check
                    changeHandler={changeHandler}
                    vals={vals}
                    name="shot"
                    label="One Shot"
                    infoText="Tile needed for win completed chow in only possible place. Examples: the 5 in a 4-5-6 or the 3 in a 1-2-3"
                  />
                  <Check
                    changeHandler={changeHandler}
                    vals={vals}
                    name="eyes"
                    label="Fishing the Eyes"
                    infoText="Tile needed for win completed the pair."
                  />
                </>
              )}
            </Box>
            <Box>
              <Button type="submit" variant="outlined" className="calc">
                Calculate Score{" "}
                {loading && <CircularProgress className="loading" size={20} />}
              </Button>
              <Button
                onClick={clearHandler}
                variant="outlined"
                className="calc"
              >
                Clear
              </Button>
            </Box>
            {(score || score === 0) && (
              <Box
                mt="15px"
                display="flex"
                className="scoreBox"
                alignItems="center"
              >
                <Box mt={0} mb={0}>
                  <p className="score">{`Score: ${score}`}</p>
                </Box>
                <Box ml={4} mb={0}>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outlined"
                    className="detail"
                  >
                    Detail
                  </Button>
                </Box>
                <LineItemDialog
                  open={open}
                  setOpen={setOpen}
                  lineItems={lineItems}
                  total={score}
                />
              </Box>
            )}
          </form>
        </Box>
        <hr />
        <p className="section">Select Tiles</p>
        <Box>
          <Grid container>
            {Object.values(tiles).map((tile) => (
              <Grid item xs={4} key={tile.icon}>
                <Chip
                  onClick={() => clickHandler(tile.code)}
                  label={tile.icon}
                  className="chipSelect"
                />
                <Box height="20px" />
              </Grid>
            ))}
          </Grid>
        </Box>
        <hr />
        <p className="section">Scoring</p>
        <p className="sub">
          Based on{" "}
          <a
            href="http://mark.random-article.com/mahjongg/basic-scoring.html"
            target="_blank"
          >
            Basic Mahjong Scoring
          </a>
          . Score doubled for pong or kong of any dragon, round wind, or own
          wind. More to come.
        </p>
      </div>
    </div>
  );
};

export default Home;
