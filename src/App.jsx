import React, { useState } from 'react';
import './App.css'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DynamicForm = () => {
  const [fields, setFields] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Validate a single set of fields
  const validateFields = (field) => {
    const fieldErrors = [];
    if (!field.name) fieldErrors.push('Name');
    if (!field.gender) fieldErrors.push('Gender');
    if (!field.hobby.length) fieldErrors.push('Hobby');
    if (!field.dob) fieldErrors.push('Date of Birth');
    return fieldErrors;
  };

  // Show toast message with errors
  const showToast = (errors) => {
    const errorMessages = errors.join(', ');
    toast.error(`Please enter valid data: ${errorMessages}`);
  };

  // Show success message
  const showSuccessToast = (message) => {
    toast.success(message);
  };

  // Handle changes to form inputs
  const handleInputChange = (index, event) => {
    const { name, value, type, checked, options } = event.target;
    const updatedFields = [...fields];

    if (type === 'checkbox') {
      const hobbies = updatedFields[index].hobby || [];
      if (checked) {
        hobbies.push(value);
      } else {
        const idx = hobbies.indexOf(value);
        if (idx > -1) {
          hobbies.splice(idx, 1);
        }
      }
      updatedFields[index] = { ...updatedFields[index], hobby: hobbies };
    } else if (name === 'hobby') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      updatedFields[index] = { ...updatedFields[index], hobby: selectedOptions };
    } else {
      updatedFields[index] = { ...updatedFields[index], [name]: value };
    }
    setFields(updatedFields);
  };

  // Add a new set of form fields
  const handleAddField = () => {
    setFields([...fields, { name: '', gender: '', hobby: [], dob: '' }]);
    setShowForm(true);
  };

  // Remove a specific set of form fields
  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    if (updatedFields.length === 0) {
      setShowForm(false);
    }
  };

  // Submit a specific set of form fields
  const handleSubmit = (index) => {
    const field = fields[index];
    const fieldErrors = validateFields(field);

    if (fieldErrors.length) {
      showToast(fieldErrors);
      return;
    }

    const data = fields[index];
    const updatedSubmittedData = [...submittedData, { ...data, hobby: Array.isArray(data.hobby) ? data.hobby : [] }];
    setSubmittedData(updatedSubmittedData);

    // Show success message
    showSuccessToast('Data added successfully!');

    // Clear the fields after submission
    const clearedFields = fields.filter((_, i) => i !== index);
    setFields(clearedFields);
    if (clearedFields.length === 0) {
      setShowForm(false);
    }
  };

  // Handle deletion of submitted data
  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    showSuccessToast('Item deleted successfully!');
  };

  return (
    <div className="form-container">
      <ToastContainer />
      {!showForm ? (
        <div className="no-data-message">
          <button
            type="button"
            onClick={handleAddField}
            className="add-btn"
          >
            Add More
          </button>
          {submittedData.length === 0 && (
            <p>Please enter data</p>
          )}
        </div>
      ) : (
        <form>
          {fields.map((field, index) => (
            <div key={index} className="form-group">
              <div className="form-fields">
                <div className="form-field">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={field.name}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <div className="form-field">
                  <label>Gender:</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={field.gender === 'Male'}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={field.gender === 'Female'}
                        onChange={(e) => handleInputChange(index, e)}
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div className="form-field">
                  <label>Hobby:</label>
                  <select
                    name="hobby"
                    value={field.hobby}
                    onChange={(e) => handleInputChange(index, e)}
                    className="hobby-dropdown"
                  >
                    <option value="">Select Hobby</option>
                    <option value="Reading">Reading</option>
                    <option value="Traveling">Traveling</option>
                    <option value="Cooking">Cooking</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>DOB:</label>
                  <input
                    type="date"
                    name="dob"
                    value={field.dob}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => handleSubmit(index)}
                  className="submit-btn"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </form>
      )}

      {submittedData.length > 0 && (
        <div className="submitted-data">
          <h2>Submitted Data</h2>
          <ul>
            {submittedData.map((data, index) => (
              <li key={index} className="submitted-item">
                <div>Name: {data.name}</div>
                <div>Gender: {data.gender}</div>
                <div>Hobby: {data.hobby.join(', ')}</div>
                <div>DOB: {data.dob}</div>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
