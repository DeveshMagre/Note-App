import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post, get } from '../services/ApiEndPoint';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '../Redux/AuthSlice';

export default function Navbar({ setFilteredNotes }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        handleSearch(searchTerm);
      } else {
        fetchNotes();
      }
    }, 500); // Debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const handleSearch = async (query) => {
    try {
      const response = await get('/notes/getnotes');
      const filtered = response.data.Notes.filter((note) =>
        note.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await get('/notes/getnotes');
      setFilteredNotes(response.data.Notes);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const request = await post('/auth/logout');
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        dispatch(logout());
        navigate('/login');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container-fluid p-2">
        <div></div>
    
        <button type="button" className="btn bg-dark text-white mx-3" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
