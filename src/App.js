import React, { useState, useEffect } from "react";
import "./App.css";
import Loader from "./Loader";
import Deck from "./Deck";
import { accessAPI } from "./utils/fetchFunctions";

export default function App() {
  const [loader, setLoader] = useState(true);
  const [decks, setDecks] = useState([]);
  const [latestDate, setLatestDate] = useState(null);

  // Loads the decks when the page loads
  useEffect(() => {
    const user = window.location.pathname.substring(1);
    accessAPI(
      "GET",
      `decks/${user}`,
      null,
      (response) => {
        setDecks(response.decks);
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

  return (
    <div className="App">
      <header>Logo</header>
      <main>
        {loader && <Loader>Cargando tus mazos</Loader>}
        {!loader && decks && (
          <>
            <div className="lastPlayed">{latestDate}</div>
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
