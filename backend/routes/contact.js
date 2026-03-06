const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// @route   POST /api/contact/submit
// @desc    Submit contact form
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' });
    }

    // Create contact
    const contact = new Contact({
      name,
      email,
      message,
      status: 'pending',
    });

    await contact.save();

    res.status(201).json({
      message: 'Thank you! Your message has been received. We will contact you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   GET /api/contact/all
// @desc    Get all contact messages (Admin only - no auth for now)
// @access  Private
router.get('/all', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      total: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact message
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact message status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;