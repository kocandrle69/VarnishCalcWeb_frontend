import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Calculator from './Calculator';
import VarnishListManager from './VarnishListManager';
import './App.css';
import logo from './Ball_logo.jpg';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div>
        <nav>
          <img src={logo} alt="Ball logo" className="logo" />
          <ul>
            <li><NavLink to="/" end activeClassName="active">{t('Calculator')}</NavLink></li>
            <li><NavLink to="/varnish-list-manager" activeClassName="active">{t('VarnishListManager')}</NavLink></li>
            <li>
              <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
                <option value="en">English</option>
                <option value="cs">Czech</option>
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="pt-BR">Brazilian Portuguese</option>
                <option value="uk">Ukrainian</option>
                <option value="hi">Hindi</option>
                <option value="pl">Polish</option>
                <option value="ar">Arabic</option>
                <option value="es">Spanish</option>
              </select>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/varnish-list-manager" element={<VarnishListManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;