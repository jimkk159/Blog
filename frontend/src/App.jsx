import React from "react";

//Custom component
import Card from "./shared/components/UI/Card";
import Navigation from "./shared/components/Navigation/Navigation";

import './APP.module.css';

function App() {
  return (
    <div>
      <Navigation />
      <main>
        <Card>
          <h1>Hello world2</h1>
        </Card>
      </main>
    </div>
  );
}

export default App;
