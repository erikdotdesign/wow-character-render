import * as React from "react";
import { useState } from "react";
import RegionControl from './RegionControl';
import RealmControl from "./RealmControl";
import CharacterControl from "./CharacterControl";
import SubmitButton from "./SubmitButton";
import WowLogo from "../assets/wow-logo.svg";

const App = () => {
  const [region, setRegion] = useState<Region>("us");
  const [realm, setRealm] = useState<string>("aegwynn");
  const [character, setCharacter] = useState<string>('');

  return (
    <div className="c-app">
      <div className="c-app__logo">
        <img src={WowLogo} />
      </div>
      <RegionControl 
        region={region}
        setRegion={setRegion} />
      <RealmControl 
        realm={realm}
        setRealm={setRealm}
        region={region} />
      <CharacterControl
        character={character}
        setCharacter={setCharacter} />
      <SubmitButton
        region={region}
        realm={realm}
        character={character} />
    </div>
  );
}

export default App;