import * as React from "react";
import { useState, useEffect } from "react";

const App = () => {
  const [region, setRegion] = useState("US");
  const [realm, setRealm] = useState("Aegwynn");
  const [character, setCharacter] = useState("Leeroy");
  const [loading, setLoading] = useState(true);

  const fetchRealms = async () => {
    const proxyUrl = `http://localhost:3000/realms?region=${region.toLowerCase()}`;
    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data) {
        console.log(data);
        setLoading(false);
        // parent.postMessage({ pluginMessage: { type: "insert-image", imageUrl: data.imageUrl } }, "*");
      } else {
        alert("Realms not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch Realms");
    }
  }

  const fetchCharacterRender = async () => {
    const query = new URLSearchParams({
      region: region.toLowerCase(),
      realm: realm.toLowerCase().replace(/\s+/g, '-'),
      character: character.toLowerCase(),
    });

    const proxyUrl = `http://localhost:3000/character-render?${query.toString()}`;

    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data.imageUrl) {
        parent.postMessage({ pluginMessage: { type: "insert-image", imageUrl: data.imageUrl } }, "*");
      } else {
        alert("Render not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch character render");
    }
  };

  useEffect(() => {
    fetchRealms();
  }, []);

  return (
    loading
    ? <div>Loading realms...</div>
    : <div style={{ padding: 16 }}>
        <h2>WoW Character Render</h2>
        <div>
          <label>Region:</label>
          <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="us, eu, etc" />
        </div>
        <div>
          <label>Realm:</label>
          <input value={realm} onChange={(e) => setRealm(e.target.value)} placeholder="e.g., aegwynn" />
        </div>
        <div>
          <label>Character:</label>
          <input value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="e.g., leeroy" />
        </div>
        <button style={{ marginTop: 12 }} onClick={fetchCharacterRender}>
          Fetch and Insert Render
        </button>
      </div>
  );
}

export default App;