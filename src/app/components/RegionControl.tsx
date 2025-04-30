import * as React from "react";

interface RegionInputProps {
  region: Region
  setRegion: (region: Region) => void
}

const RegionControl = ({ region, setRegion }: RegionInputProps) => {
  const regions: {
    value: Region,
    label: string
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

  const handleRegionChange = (selectedRegion) => {
    setRegion(selectedRegion.target.value);
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
    </div>
  )
}

export default RegionControl;