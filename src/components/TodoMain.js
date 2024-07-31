"use client";

import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Button, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Todo.module.css';

export default function TodoMain({ selectedGroupIndex, taskGroups, setTaskGroups }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    if (selectedGroupIndex !== null) {
      // Load tasks for the selected group
      setEditIndex(null);
      setEditTask('');
    }
  }, [selectedGroupIndex]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedGroups = [...taskGroups];
      updatedGroups[selectedGroupIndex].tasks.push({ text: newTask.trim(), completed: false });
      setTaskGroups(updatedGroups);
      setNewTask('');
    }
  };

  const startEditing = (taskIndex) => {
    setEditIndex(taskIndex);
    setEditTask(taskGroups[selectedGroupIndex].tasks[taskIndex].text);
  };

  const saveTask = (taskIndex) => {
    if (editTask.trim()) {
      const updatedGroups = [...taskGroups];
      updatedGroups[selectedGroupIndex].tasks[taskIndex].text = editTask.trim();
      setTaskGroups(updatedGroups);
      setEditIndex(null);
      setEditTask('');
    }
  };

  const cancelEditing = () => {
    setEditIndex(null);
    setEditTask('');
  };

  const deleteTask = (taskIndex) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[selectedGroupIndex].tasks.splice(taskIndex, 1);
    setTaskGroups(updatedGroups);
    if (editIndex === taskIndex) {
      cancelEditing();
    }
  };

  const toggleComplete = (taskIndex) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[selectedGroupIndex].tasks[taskIndex].completed = !updatedGroups[selectedGroupIndex].tasks[taskIndex].completed;
    setTaskGroups(updatedGroups);
  };

  if (selectedGroupIndex === null || taskGroups.length === 0) {
    return <div className="p-4 text-gray-200">Select a task group from the menu.</div>;
  }

  const currentGroup = taskGroups[selectedGroupIndex];

  // Ensure currentGroup is valid
  if (!currentGroup) {
    return <div className="p-4 text-gray-200">Selected task group not found.</div>;
  }

  return (
    <div className="p-4 w-[900px] rounded-md flex flex-col justify-between">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-200">{currentGroup.name}</h1>
        <p className="text-gray-400">Tasks for the selected group.</p>
      </div>

      <ul className={`list-none p-0 max-h-[300px] overflow-y-auto ${styles.customScrollbar}`}>
        {currentGroup.tasks.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-700 p-2 rounded last:border-b-0 mb-2"
          >
            {editIndex === index ? (
              <div className="flex items-center w-full">
                <TextField
                  variant="outlined"
                  size="small"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
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
                <IconButton aria-label="save task" onClick={() => saveTask(index)} className="text-green-500">
                  <SaveIcon />
                </IconButton>
                <IconButton aria-label="cancel edit" onClick={cancelEditing} className="text-red-500">
                  <CancelIcon />
                </IconButton>
              </div>
            ) : (
              <>
                <div className="flex items-center w-full">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleComplete(index)}
                    className="mr-2"
                  />
                  <span className={`text-gray-200 ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                </div>
                <div className="flex space-x-2">
                  <IconButton aria-label="edit task" onClick={() => startEditing(index)} className="text-yellow-500">
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete task" onClick={() => deleteTask(index)} className="text-red-500">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 max-w-[250px]">
        <TextField
          label="New Task"
          variant="outlined"
          size="small"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
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
          onClick={addTask}
          className="w-full"
        >
          Add Task
        </Button>
      </div>
    </div>
  );
}