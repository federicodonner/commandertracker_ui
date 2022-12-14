import React, { useState, useEffect } from "react";
import "./App.css";
import { logo } from "./images/logo.png";
import Loader from "./Loader";
import Deck from "./Deck";
import { accessAPI, convertDate } from "./utils/fetchFunctions";

export default function App() {
  const [loader, setLoader] = useState(true);
  const [decks, setDecks] = useState([]);
  const [latestDate, setLatestDate] = useState(null);
  const [currentSort, setCurrentSort] = useState("nombre");

  // Loads the decks when the page loads
  useEffect(() => {
    const user = window.location.pathname.substring(1);
    accessAPI(
      "GET",
      `decks/${user}`,
      null,
      (response) => {
        setDecks(response.decks.sort(decksSortByName));
        setLatestDate(response.latestDate);
      },
      (response) => {
        alert(response.message);
      }
    );
  }, []);

  // When the decks are loaded, turn off the loader
  useEffect(() => {
    if (decks && latestDate) {
      setLoader(false);
    }
  }, [decks, latestDate]);

  function toggleSort() {
    switch (currentSort) {
      case "nombre":
        setDecks(decks.sort(decksSortByDate));
        setCurrentSort("fecha");
        break;
      case "fecha":
        setDecks(decks.sort(decksSortByName));
        setCurrentSort("nombre");
        break;
      default:
        setCurrentSort("nombre");
    }
  }

  function decksSortByDate(a, b) {
    if (a.lastPlayed < b.lastPlayed) {
      return 1;
    }
    if (a.lastPlayed > b.lastPlayed) {
      return -1;
    }
    return 0;
  }

  function decksSortByName(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  return (
    <div className="App">
      <header>Logo</header>
      <main>
        {loader && <Loader>Cargando tus mazos</Loader>}
        {!loader && decks && (
          <>
            <div className="lastPlayed">
              La última vez que jugaste fue el {convertDate(latestDate)[0]}
            </div>
            <div className="sortOptions">
              Mazos ordenados por:
              <button onClick={toggleSort}>{currentSort}</button>
            </div>
            <div className="decksContainer">
              {decks.map((deck) => {
                return (
                  <Deck
                    key={deck.id}
                    deck={deck}
                    user={window.location.pathname.substring(1)}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
