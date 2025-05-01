import * as React from "react";

interface SubmitButtonProps {
  region: Region,
  realm: string,
  character: string
}

const SubmitButton = ({ region, realm, character }: SubmitButtonProps) => {

  const fetchCharacterRender = async () => {
    const query = new URLSearchParams({
      region,
      realm,
      character: character.toLowerCase(),
    });

    const proxyUrl = `http://localhost:3000/character-render?${query.toString()}`;

    try {
      const response = await fetch(proxyUrl);
      const render = await response.json();

      if (render.characterUrl) {
        parent.postMessage({ 
          pluginMessage: { 
            type: "add-render", 
            render
          } 
        }, "*");
      } else {
        alert("Render not found!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch character render");
    }
  };

  return (
    <button 
      className="c-button" 
      onClick={fetchCharacterRender}
      disabled={character.length === 0}>
      Add Render
    </button>
  );
}

export default SubmitButton;