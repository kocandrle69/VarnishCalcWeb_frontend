import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useTranslation } from 'react-i18next';

function Calculator() {
  const { t } = useTranslation();

  const [inputs, setInputs] = useState({
    diameter: '',
    length: '',
    solidContent: '',
    density: '',
    minThickness: '',
    maxThickness: '',
    minWeight: '',
    maxWeight: ''
  });
  const [results, setResults] = useState(null);
  const [isGrams, setIsGrams] = useState(false);
  const [varnishes, setVarnishes] = useState([]);
  const [selectedVarnish, setSelectedVarnish] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/varnishes')
      .then(response => {
        setVarnishes(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the varnishes!", error);
      });
  }, []);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleVarnishChange = (e) => {
    const varnishId = e.target.value;
    setSelectedVarnish(varnishId);
    const selectedVarnishData = varnishes.find(varnish => varnish.id === parseInt(varnishId));
    if (selectedVarnishData) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        solidContent: selectedVarnishData.solidContent,
        density: selectedVarnishData.density,
        minThickness: selectedVarnishData.minThickness,
        maxThickness: selectedVarnishData.maxThickness
      }));
    }
  };

  const handleToggle = () => {
    setIsGrams(!isGrams);
    setInputs((prevInputs) => ({
      ...prevInputs,
      minThickness: '',
      maxThickness: '',
      minWeight: '',
      maxWeight: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedInputs = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, parseFloat(String(value).replace(',', '.'))])
    );

    try {
      const response = await axios.post('http://localhost:3000/calculate', formattedInputs);
      setResults(response.data);
    } catch (error) {
      console.error("There was an error making the request", error);
    }
  };

  const formatResult = (result) => (result !== null && result !== undefined && result !== 0) ? result.toFixed(2) : '';

  return (
    <div>
      <h2>{t('Layer Calculator')}</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedVarnish} onChange={handleVarnishChange}>
          <option value="">{t('Select Varnish')}</option>
          {varnishes.map(varnish => (
            <option key={varnish.id} value={varnish.id}>{varnish.name}</option>
          ))}
        </select>
        <input type="text" name="diameter" placeholder={t('Tube Diameter (mm)')} value={inputs.diameter} onChange={handleChange} />
        <input type="text" name="length" placeholder={t('Tube Length (mm)')} value={inputs.length} onChange={handleChange} />
        <input type="text" name="solidContent" placeholder={t('% Solid Content')} value={inputs.solidContent} onChange={handleChange} />
        <input type="text" name="density" placeholder={t('Density (g/cm³)')} value={inputs.density} onChange={handleChange} />
        {isGrams ? (
          <>
            <input type="text" name="minWeight" placeholder={t('Min Layer after Oven (g)')} value={inputs.minWeight} onChange={handleChange} />
            <input type="text" name="maxWeight" placeholder={t('Max Layer after Oven (g)')} value={inputs.maxWeight} onChange={handleChange} />
          </>
        ) : (
          <>
            <input type="text" name="minThickness" placeholder={t('Min Layer after Oven (μm)')} value={inputs.minThickness} onChange={handleChange} />
            <input type="text" name="maxThickness" placeholder={t('Max Layer after Oven (μm)')} value={inputs.maxThickness} onChange={handleChange} />
          </>
        )}
        <button type="submit">{t('Calculate')}</button>
        <button type="button" onClick={handleToggle}>
          {isGrams ? t('Switch to Microns') : t('Switch to Grams')}
        </button>
      </form>
      {results && (
        <div className="results-container">
          <div className="results-box">
            <h3>{t('Layer in g/can')}</h3>
            <p className="dry-layer">{t('Dry')}: {formatResult(isGrams ? results.minDryLayerGFromGrams : results.minDryLayerGFromMicrons)} - {formatResult(isGrams ? results.maxDryLayerGFromGrams : results.maxDryLayerGFromMicrons)}</p>
            <p className="wet-layer">{t('Wet')}: {formatResult(isGrams ? results.minWetLayerGFromGrams : results.minWetLayerGFromMicrons)} - {formatResult(isGrams ? results.maxWetLayerGFromGrams : results.maxWetLayerGFromMicrons)}</p>
          </div>
          <div className="results-box">
            <h3>{t('Layer in g/m²')}</h3>
            <p className="dry-layer">{t('Dry')}: {formatResult(isGrams ? results.minDryLayerGM2FromGrams : results.minDryLayerGM2FromMicrons)} - {formatResult(isGrams ? results.maxDryLayerGM2FromGrams : results.maxDryLayerGM2FromMicrons)}</p>
            <p className="wet-layer">{t('Wet')}: {formatResult(isGrams ? results.minWetLayerGM2FromGrams : results.minWetLayerGM2FromMicrons)} - {formatResult(isGrams ? results.maxWetLayerGM2FromGrams : results.maxWetLayerGM2FromMicrons)}</p>
          </div>
          <div className="results-box">
            <h3>{t('Layer in μm')}</h3>
            <p className="dry-layer">{t('Dry')}: {formatResult(isGrams ? results.minDryLayerUmFromGrams : results.minDryLayerUmFromMicrons)} - {formatResult(isGrams ? results.maxDryLayerUmFromGrams : results.maxDryLayerUmFromMicrons)}</p>
            <p className="wet-layer">{t('Wet')}: {formatResult(isGrams ? results.minWetLayerUmFromGrams : results.minWetLayerUmFromMicrons)} - {formatResult(isGrams ? results.maxWetLayerUmFromGrams : results.maxWetLayerUmFromMicrons)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;