"use client";

import React from 'react';
import { IconButton, TextField, Button, Tooltip } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import styles from './Todo.module.css';

export default function TodoMenu({ taskGroups, setTaskGroups, onGroupSelect }) {
  const [newGroupName, setNewGroupName] = React.useState('');
  const [editIndex, setEditIndex] = React.useState(null);
  const [editGroupName, setEditGroupName] = React.useState('');

  const addTaskGroup = () => {
    if (newGroupName.trim()) {
      setTaskGroups([...taskGroups, { name: newGroupName.trim(), tasks: [] }]);
      setNewGroupName('');
    }
  };

  const startEditing = (index) => {
    setEditIndex(index);
    setEditGroupName(taskGroups[index].name);
  };

  const saveGroupName = (index) => {
    if (editGroupName.trim()) {
      const updatedGroups = [...taskGroups];
      updatedGroups[index].name = editGroupName.trim();
      setTaskGroups(updatedGroups);
      setEditIndex(null);
      setEditGroupName('');
    }
  };

  const cancelEditing = () => {
    setEditIndex(null);
    setEditGroupName('');
  };

  const deleteTaskGroup = (index) => {
    const updatedGroups = taskGroups.filter((_, i) => i !== index);
    setTaskGroups(updatedGroups);
    if (editIndex === index) {
      cancelEditing();
    }
  };

  return (
    <div className="flex flex-col justify-between p-4 w-[300px] bg-gray-700 rounded-md">
      <div className="flex items-center justify-between space-x-2 mb-4">
        <div className="flex items-center">
          <ListAltIcon fontSize="large" className="text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-200 ml-2">Todo List</h2>
        </div>
      </div>

      <ul className={`list-none p-0 overflow-y-auto max-h-[400px] ${styles.customScrollbar}`}>
        {taskGroups.map((group, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-800 hover:bg-gray-600 cursor-pointer ease-in-out transition-colors duration-300 p-2 rounded mb-2"
            onClick={() => onGroupSelect(index)}
          >
            {editIndex === index ? (
              <div className="flex items-center w-full">
                <TextField
                  variant="outlined"
                  size="small"
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  className="flex-grow mr-2"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgb(59 130 246)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgb(59 130 246)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
                <Tooltip title="Save">
                  <IconButton aria-label="save group name" onClick={() => saveGroupName(index)} className="text-green-500">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel">
                  <IconButton aria-label="cancel edit" onClick={cancelEditing} className="text-red-500">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ) : (
              <div className="flex items-center w-full justify-between">
                <span className="text-gray-200">{group.name}</span>
                <div className="flex space-x-2 ml-4">
                  <Tooltip title="Edit">
                    <IconButton aria-label="edit group" onClick={() => startEditing(index)} className="text-yellow-500">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton aria-label="delete group" onClick={() => deleteTaskGroup(index)} className="text-red-500">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <TextField
          label="New Task Group"
          variant="outlined"
          size="small"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full mb-2"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'rgb(59 130 246)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(59 130 246)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={addTaskGroup}
          className="w-full"
        >
          <AddCircleIcon className="mr-1" />
          Add Task Group
        </Button>
      </div>
    </div>
  );
}