const ServiceDetail = require('../db/models/servicedetail');
const ServiceMan = require('../db/models/serviceman');
const cloudinary = require('../utils/cloudinary');


const createServiceDetail = async (req, res) => {

  const { nanoid } = await import('nanoid');
  const customId = 'srv_' + nanoid(10);

  try {
    const {
      servicemanId,
      name,
      serviceHead,
      category,
      location,
      price,
      about
    } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Image is required.' });
    }

    const servicemanExists = await ServiceMan.findByPk(servicemanId);
    if (!servicemanExists) {
      return res.status(404).json({ message: 'ServiceMan not found.' });
    }

    // Upload to cloudinary
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: 'servicemen'
    });


    const detail = await ServiceDetail.create({
      id: customId,
      servicemanId,
      name,
      serviceHead,
      category,
      location,
      price,
      about,
      imageUrl: uploaded.secure_url,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Service detail created successfully.',
      detail
    });

  } catch (error) {
    console.error('Service Detail Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getServiceDetailByServiceManId = async (req, res) => {
  try {
    const { servicemanId } = req.params;

    const detail = await ServiceDetail.findOne({
      where: { servicemanId }
    });

    if (!detail) {
      return res.status(404).json({ message: 'Service detail not found for this serviceman.' });
    }

    res.status(200).json({
      message: 'Service detail retrieved successfully.',
      detail
    });

  } catch (error) {
    console.error('Get Service Detail Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateServiceDetail = async (req, res) => {
  try {
    const { servicemanId } = req.params;

    const {
      name,
      serviceHead,
      category,
      location,
      price,
      about
    } = req.body;

    const file = req.file;

    // 1. Check if service detail exists
    const existingDetail = await ServiceDetail.findOne({
      where: { servicemanId }
    });

    if (!existingDetail) {
      return res.status(404).json({ message: 'Service detail not found for this serviceman.' });
    }

    // 2. If new image is uploaded, upload to Cloudinary
    let imageUrl = existingDetail.imageUrl;
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: 'servicemen'
      });
      imageUrl = uploaded.secure_url;
    }

    // 3. Update detail
    await existingDetail.update({
      name: name || existingDetail.name,
      serviceHead: serviceHead || existingDetail.serviceHead,
      category: category || existingDetail.category,
      location: location || existingDetail.location,
      price: price || existingDetail.price,
      about: about || existingDetail.about,
      imageUrl,
      updatedAt: new Date()
    });

    res.status(200).json({
      message: 'Service detail updated successfully.',
      detail: existingDetail
    });

  } catch (error) {
    console.error('Update Service Detail Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getServicemenByCategoryAndLocation = async (req, res) => {
  try {
    const { category, location } = req.query;

    if (!category || !location) {
      return res.status(400).json({ message: 'Category and location are required.' });
    }

    const servicemen = await ServiceDetail.findAll({
      where: {
        category,
        location
      },
      include: [
        {
          model: ServiceMan,
          as: 'serviceman',
          attributes: ['id', 'email', 'serviceType']
        }
      ]
    });

    if (servicemen.length === 0) {
      return res.status(404).json({ message: 'No servicemen found for this category and location.' });
    }

    res.status(200).json({
      message: 'Servicemen fetched successfully.',
      servicemen
    });
  } catch (error) {
    console.error('Error in getServicemenByCategoryAndLocation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getServicemenByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    const servicemen = await ServiceDetail.findAll({
      where: { location },
      include: [
        {
          model: ServiceMan,
          as: 'serviceman',
          attributes: ['id', 'email', 'serviceType']
        }
      ]
    });

    if (servicemen.length === 0) {
      return res.status(404).json({ message: 'No servicemen found for this location.' });
    }

    res.status(200).json({
      message: 'Servicemen fetched successfully.',
      servicemen
    });
  } catch (error) {
    console.error('Error in getServicemenByLocation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  createServiceDetail,
  getServiceDetailByServiceManId,
  updateServiceDetail,
  getServicemenByCategoryAndLocation,
  getServicemenByLocation
};
