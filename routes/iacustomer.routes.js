var express = require('express');
var router = express.Router();
const iacustomer = require('../controllers/iacustomer.controller');

// Create a new Customer
router.post('/', iacustomer.create);

// Retrieve all Customers
router.get('/', iacustomer.findAll);

// Retrieve all Customers with balances
router.get('/withbalance', iacustomer.findAllWithBalance);

// Retrieve a single Customer with customerId
router.get('/:customerId', iacustomer.findOne);

// Update a Customer with customerId
router.put('/:customerId', iacustomer.update);

// Update a Customer with customerId
router.post('/activation', iacustomer.updateActivation);

// Delete a Customer with customerId
router.delete('/:customerId', iacustomer.delete);


module.exports = router;
