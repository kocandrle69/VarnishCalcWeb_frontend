import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useTranslation } from 'react-i18next';

function VarnishListManager() {
  const { t } = useTranslation();
  const [varnishes, setVarnishes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    solidContent: '',
    density: '',
    minThickness: '',
    maxThickness: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      axios.get('http://localhost:3000/varnishes')
        .then(response => {
          setVarnishes(response.data);
        })
        .catch(error => {
          console.error(t('There was an error fetching the varnishes!'), error);
        });
    }
  }, [authenticated, t]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = '0852'; // Replace with your actual password
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert(t('Incorrect password'));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedForm = {
      ...form,
      solidContent: parseFloat(String(form.solidContent).replace(',', '.')),
      density: parseFloat(String(form.density).replace(',', '.')),
      minThickness: parseFloat(String(form.minThickness).replace(',', '.')),
      maxThickness: parseFloat(String(form.maxThickness).replace(',', '.'))
    };

    if (editMode) {
      axios.put(`http://localhost:3000/varnishes/${editId}`, formattedForm)
        .then(() => {
          setVarnishes((prevVarnishes) =>
            prevVarnishes.map((varnish) =>
              varnish.id === editId ? { ...varnish, ...formattedForm } : varnish
            )
          );
          setEditMode(false);
          setEditId(null);
          setForm({
            name: '',
            solidContent: '',
            density: '',
            minThickness: '',
            maxThickness: ''
          });
        })
        .catch(error => {
          console.error(t('There was an error updating the varnish!'), error);
        });
    } else {
      axios.post('http://localhost:3000/varnishes', formattedForm)
        .then(response => {
          setVarnishes([...varnishes, response.data]);
          setForm({
            name: '',
            solidContent: '',
            density: '',
            minThickness: '',
            maxThickness: ''
          });
        })
        .catch(error => {
          console.error(t('There was an error creating the varnish!'), error);
        });
    }
  };

  const handleEdit = (varnish) => {
    setEditMode(true);
    setEditId(varnish.id);
    setForm({
      name: varnish.name,
      solidContent: varnish.solidContent,
      density: varnish.density,
      minThickness: varnish.minThickness,
      maxThickness: varnish.maxThickness
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/varnishes/${id}`)
      .then(() => {
        setVarnishes(varnishes.filter(varnish => varnish.id !== id));
      })
      .catch(error => {
        console.error(t('There was an error deleting the varnish!'), error);
      });
  };

  if (!authenticated) {
    return (
      <form onSubmit={handlePasswordSubmit} className="password-form">
        <input
          type="password"
          placeholder={t('Enter Password')}
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">{t('Submit')}</button>
      </form>
    );
  }

  return (
    <div>
      <h2>{t('VarnishListManager')}</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input type="text" name="name" placeholder={t('Varnish Name')} value={form.name} onChange={handleChange} />
        <input type="text" name="solidContent" placeholder={t('% Solid Content')} value={form.solidContent} onChange={handleChange} />
        <input type="text" name="density" placeholder={t('Density (g/cm³)')} value={form.density} onChange={handleChange} />
        <input type="text" name="minThickness" placeholder={t('Min Layer (μm)')} value={form.minThickness} onChange={handleChange} />
        <input type="text" name="maxThickness" placeholder={t('Max Layer (μm)')} value={form.maxThickness} onChange={handleChange} />
        <button type="submit">{editMode ? t('Edit') : t('Add')}</button>
      </form>
      <div className="results-container">
        {varnishes.map((varnish) => (
          <div key={varnish.id} className="results-box">
            <h3>{varnish.name}</h3>
            <p>{t('% Solid Content')}: {varnish.solidContent}</p>
            <p>{t('Density (g/cm³)')}: {varnish.density}</p>
            <p>{t('Min Layer (μm)')}: {varnish.minThickness}μm</p>
            <p>{t('Max Layer (μm)')}: {varnish.maxThickness}μm</p>
            <button className="edit-button" onClick={() => handleEdit(varnish)}>{t('Edit')}</button>
            <button className="delete-button" onClick={() => handleDelete(varnish.id)}>{t('Delete')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VarnishListManager;