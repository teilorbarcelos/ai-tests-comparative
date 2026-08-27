import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
);