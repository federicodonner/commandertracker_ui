import React, { useState, useEffect } from "react";
import { accessAPI, convertDate } from "./utils/fetchFunctions";
import Loader from "./Loader";

export default function Deck(props) {
  const [loader, setLoader] = useState(true);
  const [query, setQuery] = useState(false);
  const [deck, setDeck] = useState({});

  // When the component loads, load the deck from props to state
  useEffect(() => {
    setDeck(props.deck);
  }, [props.deck]);

  // When the deck is loaded, turn off the loader
  useEffect(() => {
    if (deck) {
      setLoader(false);
    }
  }, [deck]);

  // Handler for the update count buttons
  function updateCount(update) {
    setLoader(true);
    setQuery(false);
    let url;
    if (update === -1) {
      url = `count/${props.user}/${deck.id}/minus`;
    } else {
      url = `count/${props.user}/${deck.id}`;
    }
    accessAPI(
      "PUT",
      url,
      null,
      (response) => {
        setDeck(response);
      },
      (response) => {
        setLoader(false);
        alert(response.message);
      }
    );
  }

  return (
    <div className="deckContainer">
      {loader && <Loader />}
      {!loader && deck && (
        <div
          className="deck"
          style={{
            backgroundImage: `radial-gradient(transparent, rgb(0, 0, 0)), url(${deck.mainCardImage})`,
          }}
        >
          {!query && (
            <div
              className="dataContainer flexContainer vertical spaceBetween"
              onClick={() => {
                setQuery(true);
              }}
            >
              <div className="name"> {deck.name}</div>
              <div className="detailsContainer">
                <div className="detail">Veces jugado: {deck.played}</div>
                {deck.played !== 0 && (
                  <div className="detail">
                    Última partida: {convertDate(deck.lastPlayed)[1]}
                  </div>
                )}
              </div>
            </div>
          )}
          {query && (
            <div className="deckQuery flexContainer">
              <i
                className="lni lni-circle-plus roundButton centered"
                onClick={() => {
                  updateCount(1);
                }}
              ></i>
              {deck.played > 0 && (
                <i
                  className="lni lni-circle-minus roundButton centered"
                  onClick={() => {
                    updateCount(-1);
                  }}
                ></i>
              )}
              <i
                className="lni lni-cross-circle roundButton centered"
                onClick={() => {
                  setQuery(false);
                }}
              ></i>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
