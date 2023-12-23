import { useState, React, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useBoardContext } from '../../context/BoardContext';
import NewEventSystem from '../../components/board/new event/NewEventSystem'
import PreviewImage from '../../components/Image/PreviewImage'


const EventsPage = () => {
  const { id } = useParams()
  const [events, setEvents] = useState(null);
  const { board, setBoard } = useBoardContext(id);

   const handleDeleteClick = (id) => {
    axios.delete(`http://localhost:8080/api/events/${id}`)
      .then(() => {
        console.log("event deleted")
      })
      .catch((error) => {
        console.error(error)
      })
   }

   useEffect(() => {
    axios.get(`http://localhost:8080/api/events/of-board/${id}`)
     .then((allEvents) => {
        console.log(`GOT ${allEvents.data.length} events`)
        setEvents(allEvents.data);
     })
     .catch((error) => {
        console.log(error.message)
     })
   }, [id])

  return (
    <div>
      {board ? (
        <div className="h-screen w-screen bg-gray-50 text-gray-950 dark:[#282c34]">
          <h1>Events Page for <span className='font-bold'>{board.name}</span> </h1>
          <div className="flex-col">
            {events && 
            <div className="flex gap-3 mt-5 ml-5">
              {events.map((event, index) => (
                <div className="w-[24rem] h-[24rem] border border-actionOrange" key={index}>
                    <h1 className="mb-2">{event.title}</h1>
                    <p className="mb-2">{event.description}</p>
                    <ul className="mb-2">
                      {event.tags.map((tag, i) => (
                          <li key={i}>{tag}</li>
                      ))}
                    </ul>
                    <p className="mb-2">{event.createdAt}</p>
                    <p className="mb-2">{event.updatedAt}</p>
                    <PreviewImage preview={event.preview}/>
                    <button className="p-2 text-center text-white bg-gray-800" onClick={() => {handleDeleteClick(event._id)}}>Delete</button>
                </div>   

              ))}
            </div>}
          </div>
          <NewEventSystem />
        </div>
      ) : (
        <div>
          <h1>Board not found.</h1>
        </div>
      )}

    </div>
  )
}

export default EventsPage
