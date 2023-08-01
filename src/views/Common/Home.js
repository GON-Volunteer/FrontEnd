
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import "../../assets/css/Home.css";
import { Button } from "reactstrap";
import AnnouncementPage from "./AnnouncementPage";
import AppShell from "./AppShell";
import AnnouncementList from "./AnnouncementList.js";


const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/announcements")
      .then((res) => {
        setAnnouncements(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="announcement">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement.id}>
                <a href={`/announcements/${announcement.id}`}>
                  {announcement.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const navigate = useNavigate();
  const goAncList = (e) => {
    e.preventDefault();
    navigate("/Announcement-Page");
  };
  return (
    <div className="Home-container">
      <AppShell />
      <FullCalendar
        plugins={[dayGridPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        googleCalendarApiKey={apiKey}
        events={{
          googleCalendarId: "gofn2023@gmail.com",
        }}
        eventDisplay={"block"}
        eventTextColor={"#fff"}
        eventColor={"#0343CB"}
        height={"660px"}
        width={"400px"}
        Toolbar
      />
      <div id="simple_announce_div">
        <p id="title">Announcement</p>
        <Button color="info" onClick={goAncList}>
          More
        </Button>
      </div>
      <div id="simple_announce">
        <AnnouncementList />
      </div>
    </div>
  );
};
export default Home;
