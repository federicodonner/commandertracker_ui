import React, { useState, useEffect } from "react";
import { accessAPI } from "./utils/fetchFunctions";
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
      {loader && <Loader>Actualizando datos</Loader>}
      {!loader && deck && !query && (
        <div
          className="deck"
          style={{ backgroundImage: `url(${deck.mainCardImage})` }}
          onClick={() => {
            setQuery(true);
          }}
        >
          <div className="name"> {deck.name}</div>
          <div className="detailsContainer">
            <span className="detail">Veces jugado: {deck.played}</span>
            {deck.played !== 0 && (
              <span className="detail">Última partida: {deck.lastPlayed}</span>
            )}
          </div>
        </div>
      )}
      {query && (
        <div className="deckQuery">
          <button
            onClick={() => {
              updateCount(1);
            }}
          >
            (+)
          </button>
          <button
            onClick={() => {
              updateCount(-1);
            }}
          >
            (-)
          </button>
          <button
            onClick={() => {
              setQuery(false);
            }}
          >
            (X)
          </button>
        </div>
      )}
    </div>
  );
}
