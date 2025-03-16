const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const photoUpload = upload.fields([
  { name: 'east_Photo', maxCount: 1 },
  { name: 'west_Photo', maxCount: 1 },
  { name: 'north_Photo', maxCount: 1 },
  { name: 'south_Photo', maxCount: 1 }
]);

router.post('/', photoUpload, async (req, res) => {
  try {
    const { name, phone, email, surveyNo, coordinates } = req.body;
    const coordinatesObj = JSON.parse(coordinates);

    if (!name || !email || !coordinatesObj || coordinatesObj.type !== 'Polygon') {
      return res.status(400).json({ message: 'Name, email, and coordinates are required.' });
    }

    const eastPhotoPath = req.files.east_Photo ? 'uploads/' + req.files.east_Photo[0].filename : null;
    const westPhotoPath = req.files.west_Photo ? 'uploads/' + req.files.west_Photo[0].filename : null;
    const northPhotoPath = req.files.north_Photo ? 'uploads/' + req.files.north_Photo[0].filename : null;
    const southPhotoPath = req.files.south_Photo ? 'uploads/' + req.files.south_Photo[0].filename : null;

    const query = `
      INSERT INTO polygons (name, phone, email, survey_no, geom, east_photo, west_photo, north_photo, south_photo)
      VALUES ($1, $2, $3, $4, ST_SetSRID(ST_GeomFromGeoJSON($5), 4326), $6, $7, $8, $9)
      RETURNING id;
    `;
    const values = [
      name,
      phone,
      email,
      surveyNo,
      JSON.stringify(coordinatesObj),
      eastPhotoPath,
      westPhotoPath,
      northPhotoPath,
      southPhotoPath,
    ];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Polygon added successfully.', id: result.rows[0].id });
  } catch (error) {
    console.error('Error saving polygon:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, name, phone, email, survey_no, ST_AsGeoJSON(geom) AS geom, east_photo, west_photo, north_photo, south_photo
      FROM polygons;
    `;
    const result = await pool.query(query);

    const polygons = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      surveyNo: row.survey_no,
      coordinates: JSON.parse(row.geom),
      east_Photo: row.east_photo,
      west_Photo: row.west_photo,
      north_Photo: row.north_photo,
      south_Photo: row.south_photo,
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
      SELECT id, name, phone, email, survey_no, ST_AsGeoJSON(geom) AS geom, east_photo, west_photo, north_photo, south_photo
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
      east_Photo: row.east_photo,
      west_Photo: row.west_photo,
      north_Photo: row.north_photo,
      south_Photo: row.south_photo,
    };

    res.status(200).json(polygon);
  } catch (error) {
    console.error('Error fetching polygon:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;