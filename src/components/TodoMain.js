"use client";

import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Button, Checkbox } from '@mui/material';
import { motion } from 'framer-motion';
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editIndex !== null) {
        if (e.key === 'Enter') {
          saveTask(editIndex);
        }
        if (e.key === 'Escape') {
          cancelEditing();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editIndex, editTask, taskGroups]);

  return (
    <div className="p-4 flex-grow bg-gray-800 rounded-md">
      {selectedGroupIndex === null || !taskGroups[selectedGroupIndex] ? (
        <div className="text-gray-200 text-lg">Please select a task group to view tasks.</div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-200">{taskGroups[selectedGroupIndex].name}</h3>
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Below you can add tasks to your group!</h3>
          <ul className={`list-none p-0 ${styles.customScrollbar}`} style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {taskGroups[selectedGroupIndex].tasks.map((task, taskIndex) => (
              <motion.li
                key={taskIndex}
                className="flex justify-between items-center bg-gray-700 hover:bg-gray-600 cursor-pointer ease-in-out transition-colors duration-300 p-2 rounded mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {editIndex === taskIndex ? (
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
                    <IconButton aria-label="save task" onClick={() => saveTask(taskIndex)} className="text-green-500">
                      <SaveIcon />
                    </IconButton>
                    <IconButton aria-label="cancel edit" onClick={cancelEditing} className="text-red-500">
                      <CancelIcon />
                    </IconButton>
                  </div>
                ) : (
                  <div className="flex items-center w-full justify-between">
                    <div className="flex items-center">
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleComplete(taskIndex)}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': {
                            color: 'rgb(59 130 246)',
                          },
                        }}
                      />
                      <span className={`text-gray-200 ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <IconButton aria-label="edit task" onClick={() => startEditing(taskIndex)} className="text-yellow-500">
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete task" onClick={() => deleteTask(taskIndex)} className="text-red-500">
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col">
            <TextField
              label="New Task"
              variant="outlined"
              size="small"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-[250px] mb-2"
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
              className="w-[150px]"
            >
              Add Task
            </Button>
          </div>
        </>
      )}
    </div>
  );
}