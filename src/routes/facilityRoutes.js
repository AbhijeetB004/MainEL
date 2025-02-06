import express from 'express';
import { 
  getAllFacilities,
  getFacilitiesByType,
  getNearestFacility
} from '../controllers/facilityController.js';

const router = express.Router();

router.get('/', getAllFacilities);
router.get('/type/:type', getFacilitiesByType);
router.get('/nearest', getNearestFacility);

export default router; 