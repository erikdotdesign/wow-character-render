import * as React from "react";
import { useEffect } from "react";
import realms from "../assets/realms.json";

interface RealmInputProps {
  realm: string,
  region: Region,
  setRealm: (realm: string) => void,
}

const RealmControl = ({ realm, region, setRealm }: RealmInputProps) => {

  const handleRealmChange = (selectedRealm) => {
    setRealm(selectedRealm.target.value);
  }

  const sanitizeRealm = (realmName) => {
    return realmName.replace(/\s+/g, '-').replace(/'/g, "").toLowerCase();
  }

  useEffect(() => {
    setRealm(sanitizeRealm(realms[region][0]));
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
        onChange={handleRealmChange}
        value={realm}>
        {
          realms[region].map((realmOption) => (
            <option 
              key={sanitizeRealm(realmOption)}
              value={sanitizeRealm(realmOption)}>
              {realmOption}
            </option>
          ))
        }
      </select>
    </div>
  )
}

export default RealmControl;