import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

//Redux Store
import store, { persistor } from "./store";

//Custom Component
import CustomRoute from "./routes/routes";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <CustomRoute /> */}
        <h1>Hello world!</h1>
      </PersistGate>
    </Provider>
  );
}

export default App;