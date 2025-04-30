import * as React from "react";
import { useState } from "react";
import RegionControl from './RegionControl';
import RealmControl from "./RealmControl";

const App = () => {
  const [region, setRegion] = useState<Region>("us");
  const [realm, setRealm] = useState<string>("aegwynn");
  const [character, setCharacter] = useState<string>("Leeroy");

  const fetchCharacterRender = async () => {
    const query = new URLSearchParams({
      region,
      realm,
      character: character.toLowerCase(),
    });

    console.log({
      region,
      realm,
      character
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
      <RegionControl 
        region={region}
        setRegion={setRegion} />
      <RealmControl 
        realm={realm}
        setRealm={setRealm}
        region={region} />
      <div>
        <label>Character</label>
        <input value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="e.g., leeroy" />
      </div>
      <button style={{ marginTop: 12 }} onClick={fetchCharacterRender}>
        Fetch and Insert Render
      </button>
    </div>
  );
}

export default App;