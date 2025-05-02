import * as React from "react";
import { useEffect } from "react";
import realms from "../assets/realms.json";
import ExpandIcon from '../assets/expand.svg';

interface RealmInputProps {
  realm: string,
  region: Region,
  loading: boolean,
  setRealm: (realm: string) => void,
}

const RealmControl = ({ realm, region, loading, setRealm }: RealmInputProps) => {

  const handleRealmChange = (e) => {
    setRealm(e.target.value);
  }

  const sanitizeRealmName = (realmName) => {
    return realmName.replace(/\s+/g, '-').replace(/'/g, "").toLowerCase();
  }

  const handleRegionChange = () => {
    setRealm(sanitizeRealmName(realms[region][0]));
  }

  useEffect(() => {
    handleRegionChange();
  }, [region]);

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="realm-select">
        Realm
      </label>
      <select 
        className="c-control__field" 
        name="realm" 
        id="realm-select"
        disabled={loading}
        onChange={handleRealmChange}
        value={realm}>
        {
          realms[region].map((realmOption) => (
            <option 
              key={sanitizeRealmName(realmOption)}
              value={sanitizeRealmName(realmOption)}>
              {realmOption}
            </option>
          ))
        }
      </select>
      <div className="c-control__icon">
        <img src={ExpandIcon} />
      </div>
    </div>
  )
}

export default RealmControl;