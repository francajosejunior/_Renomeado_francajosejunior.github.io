import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Play from "./pages/play";

export const MyRoutes: React.FC<{}> = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play">
          <Route path=":index" element={<Play />} />
        </Route>
      </Routes>
    </Router>
  );
};
