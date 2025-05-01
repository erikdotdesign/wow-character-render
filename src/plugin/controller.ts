figma.showUI(__html__, { width: 300, height: 528 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "add-render") {
    const { backgroundUrl, shadowUrl, characterUrl } = msg.render;

    try {
      // render background
      const backgroundResponse = await fetch(backgroundUrl);
      const backgroundArrayBuffer = await backgroundResponse.arrayBuffer();
      const backgroundImage = figma.createImage(new Uint8Array(backgroundArrayBuffer));

      // render shadow
      const shadowResponse = await fetch(shadowUrl);
      const shadowArrayBuffer = await shadowResponse.arrayBuffer();
      const shadowImage = figma.createImage(new Uint8Array(shadowArrayBuffer));

      // add background
      const backgroundRect = figma.createRectangle();
      backgroundRect.name = "Background";
      backgroundRect.resize(2400, 1860);
      backgroundRect.fills = [{ 
        type: "IMAGE",
        scaleMode: "FILL", 
        imageHash: backgroundImage.hash 
      }];

      // add shadow
      const shadowRect = figma.createRectangle();
      shadowRect.name = "Shadow";
      shadowRect.resize(392, 255);
      shadowRect.fills = [{ 
        type: "IMAGE",
        scaleMode: "FILL", 
        imageHash: shadowImage.hash 
      }];

      // render character
      const characterResponse = await fetch(characterUrl);
      const characterArrayBuffer = await characterResponse.arrayBuffer();
      const characterImage = figma.createImage(new Uint8Array(characterArrayBuffer));

      // add character
      const characterRect = figma.createRectangle();
      characterRect.name = "Character";
      characterRect.resize(1600, 1200);
      characterRect.fills = [{ 
        type: "IMAGE",
        scaleMode: "FILL", 
        imageHash: characterImage.hash 
      }];

      const viewPortX = figma.viewport.center.x;
      const viewPortY = figma.viewport.center.y;

      // position background
      backgroundRect.x = viewPortX - backgroundRect.width / 2;
      backgroundRect.y = viewPortY - backgroundRect.height / 2;

      // position shadow
      shadowRect.x = viewPortX - shadowRect.width / 2;
      shadowRect.y = (viewPortY - shadowRect.height / 2) + 504;

      // position character
      characterRect.x = viewPortX - characterRect.width / 2;
      characterRect.y = (viewPortY - characterRect.height / 2) + 140;

      // group render images
      const renderGroup = figma.group([backgroundRect, shadowRect, characterRect], figma.currentPage);
      renderGroup.name = "Wow Render";

      // Insert group
      figma.currentPage.appendChild(renderGroup);

      // select group
      figma.currentPage.selection = [renderGroup];
    } catch (error) {
      console.error('Error inserting image into Figma:', error);
    }
  }
};