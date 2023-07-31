import React from 'react';

// css
import "../../assets/css/Announcement.css";

const AnnouncementList = () => {
    // Dummy data for announcements (replace this with actual data from your backend)
    const announcements = [
      { id: 1, title: 'Announcement 1', date: '2000-00-00' },
      { id: 2, title: 'Announcement 2', date: '1998-04-25.' },
      // Add more announcements as needed
    ];
  
    return (
      <div>
        <div id="firstDiv">
            <h3 id = "Announcementtitle" className="title mx-auto">Announcement</h3>
        </div>
        <div id="secondDiv">
        <table>
          <thead>
            <tr className='title-text'>
              <th>No</th> 
              <th>Title</th>
              <th>Publishing Date</th>
            </tr>
          </thead>
          <tbody className='content-text'>
            {announcements.map((announcement) => (
              <tr key={announcement.id}>
                <td>{announcement.id}</td>
                <td>{announcement.title}</td>
                <td>{announcement.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>  
      
    );
  };
  

export default AnnouncementList;