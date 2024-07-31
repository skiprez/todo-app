"use client";

import React, { useState, useEffect } from 'react';
import TodoMenu from '@/components/TodoMenu';
import TodoMain from '@/components/TodoMain';
import SaveIcon from '@mui/icons-material/Save';
import LoadIcon from '@mui/icons-material/DriveFolderUpload';

export default function ParentComponent() {
  const [taskGroups, setTaskGroups] = useState([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);

  // useEffect(() => {
  // }, []);

  const handleGroupSelect = (index) => {
    setSelectedGroupIndex(index);
  };

  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(taskGroups, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'taskGroups.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setTaskGroups(data);
          alert('Data loaded successfully!');
        } catch (error) {
          alert('Error loading data: Invalid JSON');
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-row bg-gray-800 w-[1200px] h-[600px] rounded-md shadow-2xl relative">
      <TodoMenu
        taskGroups={taskGroups}
        setTaskGroups={setTaskGroups}
        onGroupSelect={handleGroupSelect}
      />
      <TodoMain
        selectedGroupIndex={selectedGroupIndex}
        taskGroups={taskGroups}
        setTaskGroups={setTaskGroups}
      />
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={saveToFile}
          className="px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 ease-in-out transition-colors duration-300"
        >
          <SaveIcon />
        </button>
        <input
          type="file"
          onChange={loadFromFile}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 ease-in-out transition-colors duration-300"
        >
          <LoadIcon />
        </label>
      </div>
    </div>
  );
}