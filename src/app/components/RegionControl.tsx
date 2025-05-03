import * as React from "react";
import ExpandIcon from '../assets/expand.svg';

interface RegionInputProps {
  region: Region,
  loading: boolean,
  setRegion: (region: Region) => void
}

const RegionControl = ({ region, loading, setRegion }: RegionInputProps) => {
  const regions: {
    value: Region,
    label: RegionDisplay
  }[] = [{
    value: "us",
    label: "US"
  }, {
    value: "eu",
    label: "EU"
  }, {
    value: "kr",
    label: "KR"
  }, {
    value: "tw",
    label: "TW"
  }];

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="region-select">
        Region
      </label>
      <select 
        className="c-control__field" 
        name="region" 
        id="region-select"
        disabled={loading}
        onChange={handleRegionChange}
        value={region}>
        {
          regions.map((regionOption) => (
            <option 
              key={regionOption.value}
              value={regionOption.value}>
              {regionOption.label}
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

export default RegionControl;