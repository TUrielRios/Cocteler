// This utility helps with mapping image strings from API to actual require statements
// Since JSON can't store functions or require statements directly

export const getLocalImage = (imagePath) => {
    const imageMap = {
      "../assets/images/cocktails/UnionSquare.png": require("../assets/images/cocktails/UnionSquare.png"),
      "../assets/images/cocktails/aperolSpritz.png": require("../assets/images/cocktails/aperolSpritz.png"),
      "../assets/images/cocktails/DryMartini.png": require("../assets/images/cocktails/DryMartini.png"),
      "../assets/images/cocktails/Mojito.png": require("../assets/images/cocktails/Mojito.png"),
      "../assets/images/cocktails/campariOrange.png": require("../assets/images/cocktails/campariOrange.png"),
      "../assets/images/cocktails/GinTonic.png": require("../assets/images/cocktails/GinTonic.png"),
      "../assets/images/cocktails/fernandito.png": require("../assets/images/cocktails/fernandito.png"),
      "../assets/images/cocktails/Cosmopolitan.png": require("../assets/images/cocktails/Cosmopolitan.png"),
      "../assets/images/cocktails/OldFashioned.png": require("../assets/images/cocktails/OldFashioned.png"),
      "../assets/images/cocktails/MaiTai.png": require("../assets/images/cocktails/MaiTai.png"),
      "../assets/images/cocktails/NewYorkSour.png": require("../assets/images/cocktails/NewYorkSour.png"),
      "../assets/images/cocktails/CubaLibre.png": require("../assets/images/cocktails/CubaLibre.png"),
      "../assets/images/cocktails/Daiquiri.png": require("../assets/images/cocktails/Daiquiri.png"),
      "../assets/images/cocktails/Penicillin.png": require("../assets/images/cocktails/Penicillin.png"),
      "../assets/images/cocktails/WhiskeySour.png": require("../assets/images/cocktails/WhiskeySour.png"),
      "../assets/images/cocktails/AmargoObrero.png": require("../assets/images/cocktails/AmargoObrero.png"),
      "../assets/images/cocktails/BloodyMary.png": require("../assets/images/cocktails/BloodyMary.png"),
      "../assets/images/cocktails/BasilSmash.png": require("../assets/images/cocktails/BasilSmash.png"),
      "../assets/images/cocktails/Caipirinha.png": require("../assets/images/cocktails/Caipirinha.png"),
      "../assets/images/cocktails/DirtyMartini.png": require("../assets/images/cocktails/DirtyMartini.png"),
      "../assets/images/cocktails/CloverClub.png": require("../assets/images/cocktails/CloverClub.png"),
      "../assets/images/cocktails/EspressoMartini.png": require("../assets/images/cocktails/EspressoMartini.png"),
      "../assets/images/cocktails/Gimlet.png": require("../assets/images/cocktails/gimlet.png"),
      "../assets/images/cocktails/BlackRussian.png": require("../assets/images/cocktails/BlackRussian.png"),










    }
  
    return imageMap[imagePath] || null
  }
  
  // CSS-based textures as React Native styles
  export const textures = {
    // Light pink texture with subtle patterns
    pinkLight: {
      backgroundColor: "#FFF0F0",
      backgroundImage: {
        linearGradient: {
          colors: ["rgba(255,240,240,0.8)", "rgba(255,230,230,0.4)"],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
        pattern: {
          type: "dots",
          color: "rgba(255,200,200,0.15)",
          size: 8,
          spacing: 20,
        },
      },
    },
  
    // Subtle texture with light patterns
    subtle: {
      backgroundColor: "#FFFFFF",
      backgroundImage: {
        linearGradient: {
          colors: ["rgba(250,250,250,0.8)", "rgba(245,245,245,0.4)"],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        },
        pattern: {
          type: "lines",
          color: "rgba(230,230,230,0.3)",
          size: 1,
          spacing: 10,
          angle: 45,
        },
      },
    },
  }
  
  // Function to apply texture to a style object
  export const applyTexture = (baseStyle, textureType) => {
    const texture = textures[textureType]
    if (!texture) return baseStyle
  
    return {
      ...baseStyle,
      backgroundColor: texture.backgroundColor,
      // In a real implementation, we would apply the texture pattern here
      // but for simplicity in this example, we're just changing the background color
    }
  }
  