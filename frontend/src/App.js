import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sentiment from "./pages/Sentiment";
import Prediction from "./pages/Prediction";
import Portfolio from "./pages/Portfolio";
import PortfolioMore from "./pages/PortfolioMore";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sentiment" element={<Sentiment />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio-more" element={<PortfolioMore />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
