import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import logo from "./images/logo.png";
import Loader from "./Loader";
import Deck from "./Deck";
import {
  accessAPI,
  convertDate,
  storeInLS,
  readFromLS,
  deleteFromLS,
} from "./utils/fetchFunctions";

export default function App() {
  const [loader, setLoader] = useState(true);
  const [decks, setDecks] = useState();
  const [latestDate, setLatestDate] = useState(null);
  const [currentSort, setCurrentSort] = useState("nombre");

  const [noUser, setNoUser] = useState(false);

  const userName = useRef("");

  // Loads the decks when the page loads
  useEffect(() => {
    const user = window.location.pathname.substring(1);
    if (user) {
      accessAPI(
        "GET",
        `decks/${user}`,
        null,
        (response) => {
          // If the username exists and is loaded correctly, store it in LS
          storeInLS("commandertrackerUsername", user);
          setDecks(response.decks.sort(decksSortByName));
          setLatestDate(response.latestDate);
        },
        (response) => {
          // If there was an error reading the user, delete it from LS just in case
          deleteFromLS("commandertrackerUsername");
          // Show the error
          alert(response.message);
          // Navigate back
          window.location.href = "/";
        }
      );
    } else {
      // If no user was provided, verify if it's loaded in LS
      const userNameInLS = readFromLS("commandertrackerUsername");
      if (userNameInLS) {
        // If it's stored, navigate
        window.location.href = "/" + userNameInLS;
      } else {
        // If it isn't, show the form
        setNoUser(true);
      }
    }
  }, []);

  // When the decks are loaded, turn off the loader
  useEffect(() => {
    if (decks || noUser) {
      setLoader(false);
    }
  }, [decks, noUser]);

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
    if (a.played > 0 && b.played === 0) {
      return 1;
    }

    if (a.played === 0 && b.played > 0) {
      return -1;
    }

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

  // function triggered with the enter button
  function enterHandler() {
    window.location.href = "/" + userName.current.value;
  }

  return (
    <div className="App">
      <header>
        <img className="logo" src={logo} alt="logo" />
      </header>
      <main>
        {loader && <Loader>Cargando tus mazos</Loader>}
        {!loader && decks && (
          <div className="flexContainer vertical">
            {latestDate !== 0 && (
              <div className="lastPlayed centered">
                La última vez que jugaste fue el {convertDate(latestDate)[0]}
              </div>
            )}
            <div className="sortOptions centered">
              Mazos ordenados por:
              <button onClick={toggleSort}>{currentSort}</button>
            </div>
            <div className="decksContainer centered flexContainer vertical">
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
          </div>
        )}
        {!loader && noUser && (
          <div className="flexContainer vertical">
            <div className="centered">
              Ingresá tu nombre de usuario de Moxfield
            </div>
            <input type="text" className="centered" ref={userName}></input>
            <button className="centered" onClick={enterHandler}>
              Ingresar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
