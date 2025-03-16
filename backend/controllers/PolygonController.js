const { savePolygon } = require('../models/polygonModel');

const createPolygon = async (req, res, next) => {
  const { name, phone, email, surveyNo, coordinates } = req.body;

  if (!name || !coordinates) {
    return res.status(400).json({ message: 'Name and coordinates are required.' });
  }

  try {
    const eastPhotoPath = req.files.east_Photo ? 'uploads/' + req.files.east_Photo[0].filename : null;
    const westPhotoPath = req.files.west_Photo ? 'uploads/' + req.files.west_Photo[0].filename : null;
    const northPhotoPath = req.files.north_Photo ? 'uploads/' + req.files.north_Photo[0].filename : null;
    const southPhotoPath = req.files.south_Photo ? 'uploads/' + req.files.south_Photo[0].filename : null;

    const id = await savePolygon({
      name,
      phone,
      email,
      surveyNo,
      coordinates,
      eastPhotoPath,
      westPhotoPath,
      northPhotoPath,
      southPhotoPath
    });
    res.status(201).json({ message: 'Polygon saved successfully.', id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPolygon,
};