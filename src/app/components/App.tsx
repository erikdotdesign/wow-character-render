import * as React from "react";
import { useState, useEffect } from "react";
import RegionControl from './RegionControl';
import RealmControl from "./RealmControl";
import CharacterControl from "./CharacterControl";
import SubmitButton from "./SubmitButton";
import WowLogo from "../assets/wow-logo.svg";

const App = () => {
  const [region, setRegion] = useState<Region>("us");
  const [realm, setRealm] = useState<string>("");
  const [character, setCharacter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchIpLocation = async () => {
    const ipLocatorUrl = `https://ipapi.co/json`;

    try {
      const response = await fetch(ipLocatorUrl);
      const location = await response.json();

      return location;
    } catch (err) {
      console.error(err);
    }
  };

  const updateRegionByIp = async () => {
    try {
      const location = await fetchIpLocation();

      if (location) {
        if (location.in_eu) {
          setRegion('eu');
        }
        if (location.country_code === 'KR') {
          setRegion('kr');
        }
        if (location.country_code === 'TW') {
          setRegion('tw');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    updateRegionByIp();
  }, []);

  return (
    <div className="c-app">
      <div className="c-app__logo">
        <img src={WowLogo} />
      </div>
      <RegionControl 
        region={region}
        setRegion={setRegion}
        loading={loading} />
      <RealmControl 
        realm={realm}
        setRealm={setRealm}
        region={region}
        loading={loading} />
      <CharacterControl
        character={character}
        setCharacter={setCharacter}
        loading={loading} />
      <SubmitButton
        region={region}
        realm={realm}
        character={character}
        loading={loading}
        setLoading={setLoading} />
    </div>
  );
}

export default App;