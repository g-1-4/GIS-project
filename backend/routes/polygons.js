const express = require('express');
const router = express.Router();
const pool = require('../models/db');


router.post('/', async (req, res) => {
    try {
      console.log('Request body:', req.body); 
  
      const { name, phone, email, surveyNo, coordinates } = req.body;
  
      if (!name || !email || !coordinates || coordinates.type !== 'Polygon') {
        console.error('Validation error:', { name, email, coordinates });
        return res.status(400).json({ message: 'Name, email, and coordinates are required.' });
      }
  
      const query = `
        INSERT INTO polygons (name, phone, email, survey_no, geom)
        VALUES ($1, $2, $3, $4, ST_SetSRID(ST_GeomFromGeoJSON($5), 4326))
        RETURNING id;
      `;
      const values = [name, phone, email, surveyNo, JSON.stringify(coordinates)];
  
      console.log('Executing query:', query, 'with values:', values); 
  
      const result = await pool.query(query, values);
  
      console.log('Query result:', result.rows); 
  
      res.status(201).json({ message: 'Polygon added successfully.', id: result.rows[0].id });
    } catch (error) {
      console.error('Error during POST /api/polygons:', error.stack); 
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  router.get('/', async (req, res) => {
    try {
      const query = `
        SELECT id, name, phone, email, survey_no, ST_AsGeoJSON(geom) AS geom
        FROM polygons;
      `;
      const result = await pool.query(query);
  
      const polygons = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        surveyNo: row.survey_no,
        coordinates: JSON.parse(row.geom),
      }));
  
      res.status(200).json(polygons);
    } catch (error) {
      console.error('Error fetching polygons:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  
  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = `
        SELECT id, name, phone, email, survey_no, ST_AsGeoJSON(geom) AS geom
        FROM polygons
        WHERE id = $1;
      `;
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Polygon not found.' });
      }
  
      const row = result.rows[0];
      const polygon = {
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        surveyNo: row.survey_no,
        coordinates: JSON.parse(row.geom),
      };
  
      res.status(200).json(polygon);
    } catch (error) {
      console.error('Error fetching polygon:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  
  module.exports = router;
  
  

module.exports = router;
