figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === "insert-image") {
    const imageUrl = msg.imageUrl;

    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const image = figma.createImage(new Uint8Array(arrayBuffer));

      const rect = figma.createRectangle();
      rect.resize(512, 512); // or dynamically resize based on image
      rect.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: image.hash }];

      figma.currentPage.appendChild(rect);
      figma.viewport.scrollAndZoomIntoView([rect]);
    } catch (error) {
      console.error('Error inserting image into Figma:', error);
    }
  }
};