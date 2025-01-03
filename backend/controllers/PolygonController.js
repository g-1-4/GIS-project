const { savePolygon } = require('../models/polygonModel');

const createPolygon = async (req, res, next) => {
  const { name, phone, email, surveyNo, coordinates } = req.body;

  if (!name || !coordinates) {
    return res.status(400).json({ message: 'Name and coordinates are required.' });
  }

  try {
    const id = await savePolygon({ name, phone, email, surveyNo, coordinates });
    res.status(201).json({ message: 'Polygon saved successfully.', id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPolygon,
};
