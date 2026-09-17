import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardPen, X } from 'lucide-react';

import { itemsApi } from '../../services/api';
// (Removed mock data and state declarations; they are moved inside the component)
useEffect(() => {
  const fetchItems = async () => {
    try {
      const response = await itemsApi.getAll();
      if (response.data && response.data.success) {
        setItems(response.data.data);
      } else {
        setLoadError('Failed to load items.');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setLoadError('Error loading items.');
    } finally {
      setLoadingItems(false);
    }
  };
  fetchItems();
}, []);


export const SubmitInspection = () => {
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [defectDescription, setDefectDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [submissionState, setSubmissionState] = useState('idle'); // idle | submitting | success

  // Cleanup object URL when component unmounts or photo changes
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleItemChange = (e) => {
    const itemId = e.target.value;
    const item = items.find((i) => i.itemId === itemId) || null;
    setSelectedItem(item);
    setQuantity(''); // reset quantity when item changes
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedItem) errors.item = 'Please select an item.';
    const qtyNum = parseInt(quantity, 10);
    if (!quantity) {
      errors.quantity = 'Quantity is required.';
    } else if (isNaN(qtyNum) || qtyNum < 1) {
      errors.quantity = 'Quantity must be at least 1.';
    } else if (selectedItem && qtyNum > selectedItem.normalQuantity) {
      errors.quantity = `Maximum quantity is ${selectedItem.availableQuantity}.`;
    }
    if (!defectDescription.trim()) {
      errors.defect = 'Defect description is required.';
    } else if (defectDescription.trim().length < 10) {
      errors.defect = 'Please provide a more detailed description (at least 10 characters).';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmissionState('submitting');
    setTimeout(() => {
      setSubmissionState('success');
    }, 500);
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          id="btn-back-from-submit"
          className="btn btn-secondary"
          onClick={() => navigate('/employee')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ClipboardPen size={20} style={{ color: '#22d3ee' }} />
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Submit Inspection</h2>
        </div>
      </div>

      <form className="panel-card" onSubmit={handleSubmit} noValidate>
        {/* 1. Item Information */}
        <section className="form-section" style={{ marginBottom: '2rem' }}>
          <h3 className="panel-title" style={{ marginBottom: '1rem' }}>1. Item Information</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="item-select">Item ID</label>
            <select
              id="item-select"
              className="form-input"
              value={selectedItem?.itemId || ''}
              onChange={handleItemChange}
            >
              <option value="">-- Select Item --</option>
              {MOCK_ITEMS.map((item) => (
                <option key={item.itemId} value={item.itemId}>
                  {item.itemId}
                </option>
              ))}
            </select>
            {validationErrors.item && <p className="alert alert-error" style={{ marginTop: '0.5rem' }}>{validationErrors.item}</p>}
          </div>
          {selectedItem && (
            <div className="item-details" style={{ marginTop: '1rem', lineHeight: '1.6' }}>
              <p><strong>Item Type:</strong> {selectedItem.itemType}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Available Quantity:</strong> {selectedItem.normalQuantity}</p>
            </div>
          )}
        </section>

        {/* 2. Inspection Details */}
        <section className="form-section" style={{ marginBottom: '2rem' }}>
          <h3 className="panel-title" style={{ marginBottom: '1rem' }}>2. Inspection Details</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              className="form-input"
              min="1"
              max={selectedItem?.normalQuantity || ''}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={!selectedItem}
            />
            {selectedItem && (
              <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                Available quantity: {selectedItem.normalQuantity}
              </small>
            )}
            {validationErrors.quantity && <p className="alert alert-error" style={{ marginTop: '0.5rem' }}>{validationErrors.quantity}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="defect">Describe the defect</label>
            <textarea
              id="defect"
              className="form-input"
              rows="4"
              placeholder="Enter defect details..."
              value={defectDescription}
              onChange={(e) => setDefectDescription(e.target.value)}
            ></textarea>
            {validationErrors.defect && <p className="alert alert-error" style={{ marginTop: '0.5rem' }}>{validationErrors.defect}</p>}
          </div>
        </section>

        {/* 3. Defect Photo */}
        <section className="form-section" style={{ marginBottom: '2rem' }}>
          <h3 className="panel-title" style={{ marginBottom: '1rem' }}>3. Defect Photo</h3>
          <div className="form-group">
            <label className="form-label" htmlFor="photo-upload">Upload Photo (optional)</label>
            <input
              id="photo-upload"
              type="file"
              accept="image/jpeg, image/png, image/webp, image/jpg"
              onChange={handlePhotoChange}
            />
            {photo && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>{photo.name}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={removePhoto}>
                  <X size={14} /> Remove
                </button>
              </div>
            )}
            {photoPreview && (
              <div style={{ marginTop: '1rem' }}>
                <img src={photoPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: 'var(--radius-md)' }} />
              </div>
            )}
          </div>
        </section>

        {/* 4. Summary */}
        {submissionState !== 'idle' && (
          <section className="form-section" style={{ marginBottom: '2rem' }}>
            <h3 className="panel-title" style={{ marginBottom: '1rem' }}>4. Summary</h3>
            <div className="panel-card" style={{ background: 'var(--bg-card)', padding: '1rem' }}>
              <p><strong>Item:</strong> {selectedItem?.itemId}</p>
              <p><strong>Type:</strong> {selectedItem?.itemType}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
              <p><strong>Defect:</strong></p>
              <p style={{ whiteSpace: 'pre-wrap' }}>{defectDescription}</p>
              {photo && <p><strong>Photo:</strong> {photo.name}</p>}
            </div>
          </section>
        )}

        {/* Submit Button */}
        <div style={{ textAlign: 'right' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submissionState === 'submitting'}
          >
            {submissionState === 'submitting' ? 'Validating…' : 'Submit Inspection'}
          </button>
        </div>
      </form>

      {/* Success Message */}
      {submissionState === 'success' && (
        <div className="alert alert-success" style={{ marginTop: '1.5rem' }}>
          Inspection form validated successfully.<br />Backend submission will be connected in the next task.
        </div>
      )}
    </div>
  );
};
