import "./App.css";

import { HashRouter, Route, Switch } from "react-router-dom";
import Score from "./javascript/components/Home";

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Score} />
      </Switch>
    </HashRouter>
  );
};

export default App;
