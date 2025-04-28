import * as React from "react";
import { useState } from "react";

const App = () => {
  const [region, setRegion] = useState("us");
  const [realm, setRealm] = useState("aegwynn");
  const [character, setCharacter] = useState("leeroy");

  const fetchCharacterRender = async () => {
    const query = new URLSearchParams({
      region,
      realm,
      character,
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

  return (
    <div style={{ padding: 16 }}>
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