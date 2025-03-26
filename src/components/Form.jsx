import React, { useContext, useCallback } from 'react';
import { formContext } from '../context/FormContext';
import axios from 'axios';
import { userContext } from '../context/userContext';

export default function Form() {
  const context = useContext(formContext);
  const { user } = useContext(userContext);

  const { formData, setFormData, errors, setErrors, setSubmitData, popup, setPopup, rowId, setRowId } = context;

  const validationConfig = {
    task: [
      { required: true, message: 'Please enter title' },
      { minLength: 5, message: 'Title should be at least 5 characters long' },
    ],
    dueDate: [{ required: true, message: 'Please Enter Valid Date' }],
    status: [{ required: true, message: 'Please Select Status' }],
    priority: [{ required: true, message: 'Please Select Priority' }],
    createdBy: [{ required: true, message: 'Please Enter Valid Values' }],
  };

  // Use useCallback to avoid recreating the validation function on every render
  const validate = useCallback((formPassingData) => {
    const errorsData = {};

    Object.entries(formPassingData).forEach(([key, value]) => {
      validationConfig[key]?.some((rule) => {
        if (rule.required && !value) {
          errorsData[key] = rule.message;
          return true;
        }
        if (rule.minLength && value.length < 5) {
          errorsData[key] = rule.message;
          return true;
        }

        if (!rowId) {
          if (key === 'dueDate' && isValidFutureDate(value)) {
            errorsData[key] = rule.message;
            return true;
          }
        }
      });
    });

    setErrors(errorsData);
    return errorsData;
  }, [rowId, setErrors]);

  const handler = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'dueDate') {
      const val = new Date(value);
      setFormData((prev) => ({ ...prev, [name]: val }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors({});
  }, [setFormData, setErrors]);

  
  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    formData.createdBy = user._id.toString();

    const validateResult = validate(formData);

    if (Object.keys(validateResult).length) return;

    if (rowId) {
      try {
        await axios.put(`http://localhost:3000/updateTask/${rowId}`, {
          ...formData,
          dueDate: new Date(formData.dueDate),
        });
        
        setSubmitData((prevState) =>
          prevState.map((prev) => {
            if (prev._id === rowId) {
              return { ...formData,_id:rowId}
            }
            return prev
          })
        )
       
        setRowId('');
        setPopup(false);
        return;
      } catch (err) {
        console.log(err);
        alert('Server Error Please Try After Some Time');
      }
    }

    try {
      const response = await axios.post('http://localhost:3000/createTask', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setSubmitData((prev) => [...prev, {...response.data.task,dueDate:new Date(response.data.task.dueDate)}]);

      setFormData({
        task: '',
        dueDate: new Date(),
        status: '',
        priority: '',
        createdBy: '',
      });
      setPopup(false);
    } catch (err) {
      console.log(err);
      alert('Server Error Please Try After Some Time');
    }
  }, [formData, user?._id, rowId, validate, setFormData, setSubmitData, setPopup, setRowId]);

  function isValidFutureDate(value) {
    const today = new Date();
    const inputDate = new Date(value);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate < today;
  }

  return (
    <div
      className={popup ? 'form-container active' : 'form-container'}
      onClick={() => {
        setPopup(false);
        setRowId('');
        setFormData({
          task: '',
          dueDate: new Date(),
          status: '',
          priority: '',
          createdBy: '',
        });
      }}
    >
      <form
        className={popup ? 'form active' : 'form'}
        onSubmit={submitHandler}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className='task-name'>
          <label htmlFor={'task'}>Task</label>
          <input
            type='text'
            name='task'
            value={formData.task}
            onChange={handler}
          />
          <p className='error'>{errors?.task}</p>
        </div>
        <div className='task-date'>
          <label htmlFor={'dueDate'}>Due Date</label>
          <input
            type='date'
            name='dueDate'
            value={new Date(formData.dueDate).toISOString().split('T')[0]}
            onChange={handler}
          />
          <p className='error'>{errors?.dueDate}</p>
        </div>
        <div className='task-status'>
          <label htmlFor={'status'}>Status</label>
          <select name='status' value={formData.status} onChange={handler}>
            <option value='' hidden>
              Select Status
            </option>
            <option value='completed'>Completed</option>
            <option value='incomplete'>In Complete</option>
          </select>
          <p className='error'>{errors?.status}</p>
        </div>
        <div className='task-priority'>
          <label htmlFor={'priority'}>Priority</label>
          <select name='priority' value={formData.priority} onChange={handler}>
            <option value='' hidden>
              Select priority
            </option>
            <option value='high'>High</option>
            <option value='medium'>Medium</option>
            <option value='low'>Low</option>
          </select>
          <p className='error'>{errors?.priority}</p>
        </div>
        <div className='submit-div'>
          <input
            type='submit'
            style={{ width: 100, height: 40 }}
            value={rowId === '' ? 'Submit' : 'Save'}
          />
          <button
            className='cancek-button'
            onClick={() => {
              setPopup(false);
              setFormData({
                task: '',
                dueDate: new Date(),
                status: '',
                priority: '',
                createdBy: '',
              });
              setRowId('');
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
