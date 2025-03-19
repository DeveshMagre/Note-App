import React, { useEffect, useState, useRef } from 'react';
import SideBar from '../components/SideBar';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import Notes from '../components/Notes';
import Navbar from '../components/Navbar';
import { delet, get, post, put } from '../services/ApiEndPoint';
import Modal from '../components/Modal';
import EidtModal from '../components/EidtModal';
import DeleteModal from '../components/DeleteModal';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [updatetitle, setUpdatetitle] = useState('');
  const [modalId, setModalId] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [refersh, setRefersh] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [search, setSearch] = useState('');
  const autoSaveRef = useRef(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleNoteSubmit = async () => {
    if (!title.trim()) return;
    try {
      const request = await post('/notes/create', { title });
      const response = request.data;
      if (response.success) {
       toast.success(response.message);
        setRefersh(!refersh);
        setCloseModal(true);
        setTitle('');
        const modalElement = document.getElementById('exampleModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  const handeleUpdate = async () => {
    if (!updatetitle.trim()) return;
    try {
      const request = await put(`/notes/update/${modalId}`, { title: updatetitle });
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        setRefersh(!refersh);
        setCloseModal(true);
        const modalElement = document.getElementById('editModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  const handelNotesDelete = async () => {
    try {
      const request = await delet(`/notes/delete/${modalId}`);
      const response = request.data;
      if (response.success) {
        toast.success(response.message);
        setRefersh(!refersh);
        setCloseModal(true);
        const modalElement = document.getElementById('deleteModal');
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const GetNotes = async () => {
      try {
        const request = await get('/notes/getnotes');
        const response = request.data;
        setNotes(response.Notes);
        setFilteredNotes(response.Notes);
      } catch (error) {
        console.log(error);
      }
    };
    GetNotes();
  }, [refersh]);

  useEffect(() => {
    setFilteredNotes(notes.filter(note => note.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, notes]);

  return (
    <>
      <Modal
        Modaltitle={"Write Notes"}
        value={title}
        handleChange={(e) => setTitle(e.target.value)}
        handleNoteSubmit={handleNoteSubmit}
        closeModal={closeModal}
        setCloseModal={setCloseModal}
      />
      <EidtModal
        Modaltitle={'Update Notes'}
        handleChange={(e) => setUpdatetitle(e.target.value)}
        handleNoteSubmit={handeleUpdate}
        value={updatetitle}
      />
      <DeleteModal handelNotesDelete={handelNotesDelete} />
      <div className='row '>
        <div className='col-lg-2 col-md-2 shadow d-flex min-vh-100 '>
          <SideBar />
        </div>
        <div className='col-lg-10 col-md-10 '>
          <Navbar />
          <div className='mt-3 mx-5'>
            <input
            className="mx-3 SerachInput"
              type='text'
              placeholder='Search notes...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filteredNotes.length > 0 ? (
            <div className='mt-3 mx-5'>
              <h1 className='fs-2 fw-bold'>NOTES</h1>
            </div>
          ) : (
            <div className='mt-5 justify-content-center d-flex align-items-center'>
              <h1 className='fs-1 fw-bold'>No Notes Found</h1>
            </div>
          )}
          <div className='mt-4 mx-5 row'>
            {filteredNotes.map((elem, index) => (
              <div className='col-lg-4 col-md-4 mb-5' key={index}>
                <Notes
                  title={elem.title}
                  date={formatDate(elem.updatedAt)}
                  handleUpdate={() => setModalId(elem._id)}
                  handleDelete={() => setModalId(elem._id)}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}