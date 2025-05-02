import * as React from "react";

interface CharacterControlProps {
  character: string,
  loading: boolean,
  setCharacter: (character: string) => void
}

const CharacterControl = ({ character, loading, setCharacter }: CharacterControlProps) => {

  const handleCharacterChange = (e) => {
    setCharacter(e.target.value);
  }

  return (
    <div className="c-control">
      <label 
        className="c-control__label"
        htmlFor="character-select">
        Character
      </label>
      <input 
        className="c-control__field" 
        name="character" 
        id="character-select"
        onChange={handleCharacterChange}
        value={character}
        disabled={loading}
        placeholder="Character Name">
      </input>
    </div>
  )
}

export default CharacterControl;