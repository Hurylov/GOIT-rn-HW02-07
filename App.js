import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/Store";
import Main from "./Screens/Main";

export default function App() {
  const [fontsIsLoad, setfontsIsLoad] = useState(false);
  const customFonts = {
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
  };

  useEffect(() => {
    async function loadFontsAsync() {
      await Font.loadAsync(customFonts);
      setfontsIsLoad(true);
    }
    loadFontsAsync();
  }, []);

  if (!fontsIsLoad) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
