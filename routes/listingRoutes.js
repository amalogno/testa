const express = require('express');
const { getListings, createListing, updateListing, deleteListing } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(getListings) // Public access to view items
  .post(protect, createListing); // User must be logged in to create

router.route('/:id')
  .put(protect, updateListing) // Controller handles ownership logic
  .delete(protect, deleteListing); // Controller handles ownership logic

module.exports = router;