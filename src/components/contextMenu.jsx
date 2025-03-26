import axios from 'axios';
import React from 'react'

export default function ContextMenu({setRowId,position,setPosition,rowId,setSubmitData,setFormData,submitData,setPopup}) {

  if (!position.left) return
  return (
    <div className="context-menu" style={{...position}}>
      <div
        onClick={() => {
            const {task,dueDate,status,priority,createdBy} = submitData.find((task)=>task._id.toString() === rowId) 
            setFormData({task,dueDate,status,priority,createdBy});
            setPopup(true);
            setPosition({});

        }}
      className='Edit'>
        Edit
      </div>
      <div
        onClick={async() => {
            try{
            await axios.delete('http://localhost:3000/deleteTask/'+rowId);
            }
            catch(err){
              alert("Server Error Please Try After Some Time")
              console.log(err);
            }
            setSubmitData((prev)=>prev.filter((task)=>task._id !== rowId));
            setPosition({});
            setRowId('');
        }}
      className='Delete'>
        Delete
      </div>
    </div>
  )
}
