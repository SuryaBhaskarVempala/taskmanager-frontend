import React, { useContext, useState } from 'react'
import { formContext } from '../context/FormContext'
import useFilter from '../hooks/filter';
import '../css/Home.css'
import ContextMenu from './contextMenu';
import { Link } from 'react-router';
import { userContext } from '../context/userContext';

export default function Home() {

  const [sortCallBack, SetSortCallBack] = useState(() => () => { });
  const [position, setPosition] = useState({});
  const { submitData, setSubmitData, setPopup, setFormData, rowId, setRowId } = useContext(formContext);
  const [filteredData, setQuery] = useFilter(submitData, (data) => data.priority);
  const { setUser } = useContext(userContext);

  return (
    <div className='home-container' onClick={() => {
      setPosition({});
    }}>
      <a
        className="logout"
        onClick={() => {
          localStorage.removeItem('token');
          setUser(null);
          window.location.href="/";
        }}
      >
        Logout
      </a>

      <h1>Task Manager</h1>
      <ContextMenu rowId={rowId} position={position} setPosition={setPosition} setPopup={setPopup} submitData={submitData} setSubmitData={setSubmitData} setFormData={setFormData} setRowId={setRowId} />
      <table className="task-table" onClick={() => {
        setPosition({});
      }}>
        <thead>
          <tr>
            <th>Task</th>
            <th className="dueDate-column">
              <div>
                <span>dueDate</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  viewBox="0 0 384 512"
                  className="arrow up-arrow"
                  onClick={() => {
                    SetSortCallBack(() => (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                  }}
                >
                  <title>Ascending</title>
                  <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  viewBox="0 0 384 512"
                  className="arrow down-arrow"
                  onClick={() => {
                    SetSortCallBack(() => (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
                  }}
                >
                  <title>Descending</title>
                  <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                </svg>
              </div>
            </th>
            <th>
              <select onChange={(e) => {
                setQuery(prev => ({ ...prev, status: e.target.value.toLowerCase() }));
              }}>
                <option value=''>status</option>
                <option value="incomplete">in-complete</option>
                <option value="completed">completed</option>
              </select>
            </th>
            <th>
              <select onChange={(e) => {
                setQuery(prev => ({ ...prev, priority: e.target.value.toLowerCase() }));
              }}>
                <option value=''>priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.sort(sortCallBack).map((tasks) => (
            <tr key={tasks._id} onContextMenu={(e) => {
              e.preventDefault();
              setPosition({ left: e.clientX, top: e.clientY });
              setRowId(tasks._id);
              console.log("Row ID set to:", tasks._id);  // Log to check if it's being set
            }} className={tasks.status == "completed" ? 'tr-data active' : 'tr-data'} style={{ cursor: 'pointer' }}>
              <td>{tasks.task}</td>
              <td>{new Date(tasks.dueDate).toLocaleDateString('en-GB')}</td>
              <td>{tasks.status}</td>
              <td>{tasks.priority}</td>
            </tr>
          ))}
          <tr>
            <th>Total tasks</th>
            <th style={{ cursor: 'pointer' }} onClick={() => {
              setPopup(true);
            }}>Add task</th>
            <th style={{ cursor: 'pointer' }} onClick={() => {
              SetSortCallBack(() => () => { });
            }}>Clear filters</th>
            <th>{filteredData.length}</th>
          </tr>
        </tbody>
      </table>
    </div>
  )
}