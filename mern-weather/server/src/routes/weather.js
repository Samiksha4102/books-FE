const express = require('express');
const axios = require('axios');
const Favorite = require('../models/Favorite');

function createRouter({ hasPersistence }) {
  const router = express.Router();

  // Geocode city name -> locations
  router.get('/geocode', async (req, res) => {
    try {
      const query = String(req.query.query || '').trim();
      if (!query) return res.status(400).json({ error: 'Missing query' });

      const { data } = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: {
          name: query,
          count: 5,
          language: 'en',
          format: 'json'
        }
      });

      const results = (data.results || []).map((r) => ({
        id: r.id,
        name: r.name,
        country: r.country,
        admin1: r.admin1,
        latitude: r.latitude,
        longitude: r.longitude
      }));

      res.json({ results });
    } catch (error) {
      console.error('Geocode error', error.message);
      res.status(500).json({ error: 'Failed to geocode' });
    }
  });

  // Forecast for lat/lon
  router.get('/forecast', async (req, res) => {
    try {
      const latitude = Number(req.query.lat);
      const longitude = Number(req.query.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return res.status(400).json({ error: 'Invalid lat/lon' });
      }
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current_weather: true,
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
          timezone: 'auto',
          forecast_days: 5
        }
      });
      res.json({ forecast: data });
    } catch (error) {
      console.error('Forecast error', error.message);
      res.status(500).json({ error: 'Failed to fetch forecast' });
    }
  });

  // Favorites
  router.get('/favorites', async (req, res) => {
    try {
      if (!hasPersistence) return res.json({ favorites: [] });
      const favorites = await Favorite.find().sort({ createdAt: -1 }).lean();
      res.json({ favorites });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list favorites' });
    }
  });

  router.post('/favorites', async (req, res) => {
    try {
      const { name, latitude, longitude } = req.body || {};
      if (!name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return res.status(400).json({ error: 'Invalid favorite payload' });
      }
      if (!hasPersistence) return res.status(200).json({ favorite: { name, latitude, longitude, _id: 'memory' } });
      const favorite = await Favorite.create({ name, latitude, longitude });
      res.status(201).json({ favorite });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save favorite' });
    }
  });

  router.delete('/favorites/:id', async (req, res) => {
    try {
      const id = req.params.id;
      if (!hasPersistence) return res.status(204).end();
      await Favorite.findByIdAndDelete(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete favorite' });
    }
  });

  return router;
}

module.exports = { createRouter };