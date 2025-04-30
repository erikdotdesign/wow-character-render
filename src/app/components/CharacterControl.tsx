import * as React from "react";

interface CharacterControlProps {
  character: string
  setCharacter: (character: string) => void
}

const CharacterControl = ({ character, setCharacter }: CharacterControlProps) => {

  const handleCharacterChange = (selectedCharacter) => {
    setCharacter(selectedCharacter.target.value);
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
        placeholder="Character Name">
      </input>
    </div>
  )
}

export default CharacterControl;