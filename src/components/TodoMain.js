"use client";

import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Button, Checkbox, Chip, Menu, MenuItem, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './Todo.module.css';

export default function TodoMain({ selectedGroupIndex, taskGroups, setTaskGroups }) {
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [newTask, setNewTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsAnchorEl, setTagsAnchorEl] = useState(null);

  useEffect(() => {
    if (selectedGroupIndex !== null) {
      setEditIndex(null);
      setEditTask('');
      setSearchQuery('');
      setSelectedTags([]);
    }
  }, [selectedGroupIndex]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedGroups = [...taskGroups];
      updatedGroups[selectedGroupIndex].tasks.push({
        text: newTask.trim(),
        completed: false,
        tags: newTag ? newTag.split(',').map(tag => tag.trim()) : []
      });
      setTaskGroups(updatedGroups);
      setNewTask('');
      setNewTag('');
    }
  };

  const startEditing = (taskIndex) => {
    setEditIndex(taskIndex);
    setEditTask(taskGroups[selectedGroupIndex].tasks[taskIndex].text);
    setNewTag(taskGroups[selectedGroupIndex].tasks[taskIndex].tags.join(', '));
  };

  const saveTask = (taskIndex) => {
    if (editTask.trim()) {
      const updatedGroups = [...taskGroups];
      updatedGroups[selectedGroupIndex].tasks[taskIndex].text = editTask.trim();
      updatedGroups[selectedGroupIndex].tasks[taskIndex].tags = newTag.split(',').map(tag => tag.trim());
      setTaskGroups(updatedGroups);
      setEditIndex(null);
      setEditTask('');
      setNewTag('');
    }
  };

  const cancelEditing = () => {
    setEditIndex(null);
    setEditTask('');
    setNewTag('');
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

  const filteredTasks = taskGroups[selectedGroupIndex]?.tasks.filter(task => {
    const taskMatches = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    const tagsMatch = task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const tagsFilterMatch = selectedTags.length === 0 || selectedTags.every(tag => task.tags.includes(tag));
    return (taskMatches || tagsMatch) && tagsFilterMatch;
  });

  const allTags = filteredTasks?.reduce((acc, task) => {
    task.tags.forEach(tag => {
      if (!acc.includes(tag)) acc.push(tag);
    });
    return acc;
  }, []);

  const handleTagsMenuClick = (event) => {
    setTagsAnchorEl(event.currentTarget);
  };

  const handleTagsMenuClose = () => {
    setTagsAnchorEl(null);
  };

  const handleTagSelect = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    handleTagsMenuClose();
  };

  return (
    <div className="p-4 flex-grow bg-gray-800 rounded-md">
      {selectedGroupIndex === null || !taskGroups[selectedGroupIndex] ? (
        <div className="text-gray-200 text-lg">Please select a task group to view tasks.</div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-200">{taskGroups[selectedGroupIndex].name}</h3>
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Below you can add tasks to your group!</h3>

          {/* Search and Tags Menu */}
          <div className="flex items-center mb-4">
            <TextField
              label="Search Tasks"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mr-2"
              sx={{
                width: 250,
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

            <IconButton
              aria-label="tags menu"
              onClick={handleTagsMenuClick}
              sx={{
                color: 'white',
                borderColor: 'rgb(59 130 246)',
                '&:hover': {
                  backgroundColor: 'rgb(59 130 246)',
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={tagsAnchorEl}
              open={Boolean(tagsAnchorEl)}
              onClose={handleTagsMenuClose}
              PaperProps={{
                sx: {
                  maxHeight: 400,
                  width: 250,
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                },
              }}
            >
              {allTags?.map(tag => (
                <MenuItem
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  sx={{
                    color: 'black',
                    backgroundColor: selectedTags.includes(tag) ? 'rgb(59 130 246)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgb(59 130 246)',
                    },
                  }}
                >
                  {tag}
                </MenuItem>
              ))}
              {allTags?.length === 0 && (
                <MenuItem disabled>No tags available</MenuItem>
              )}
            </Menu>
          </div>

          {/* Task List */}
          <ul className={`list-none p-0 ${styles.customScrollbar}`} style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredTasks.map((task, taskIndex) => (
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
                    <TextField
                      variant="outlined"
                      size="small"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-grow mr-2"
                      placeholder="Enter tags (comma separated)"
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
                      <div className="flex ml-2">
                        {task.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            className="ml-1"
                            sx={{ color: 'white', backgroundColor: 'rgb(59 130 246)' }}
                          />
                        ))}
                      </div>
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

          {/* Add New Task */}
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
            <TextField
              label="Tags (comma separated)"
              variant="outlined"
              size="small"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
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
              sx={{
                backgroundColor: 'rgb(59 130 246)',
                '&:hover': {
                  backgroundColor: 'rgb(59 130 246)',
                },
              }}
            >
              Add Task
            </Button>
          </div>
        </>
      )}
    </div>
  );
}