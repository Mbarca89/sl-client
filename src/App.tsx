import "./App.css"
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { useState, useEffect, Suspense } from "react"
import { useRecoilState } from "recoil"
import { logState, userState } from "./app/store"
import { Toaster } from 'react-hot-toast';
import NavBar from "./components/Nav/NavBar"
import Landing from "./views/landing/Landing"
import Home from "./views/Home/Home"
import Users from "./views/Users/Users"
import Tickets from "./views/Tickets/Tickets"
import TicketReports from "./views/TicketReports/TicketReports"
import TicketDetail from "./views/TicketDetail/TicketDetail"
import SockJS from 'sockjs-client';
import type { Client } from 'stompjs';
import Stomp from 'stompjs';
import { notifyTicket } from "./components/Toaster/Toaster"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [isLogged, setLogged] = useRecoilState(logState)
  const [user, setUser] = useRecoilState(userState)

  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    if (!initialCheckDone) {
      if (localStorage.getItem("userName")) {
        setLogged(true)
        setUser({
          name: localStorage.getItem("name") || "",
          surname: localStorage.getItem("surname") || "",
          id: localStorage.getItem("id") || "",
          userName: localStorage.getItem("userName") || "",
          role: localStorage.getItem("role") || "",
          area: localStorage.getItem("area") || "",
          token: localStorage.getItem("token") || ""
        })
      } else if (user.userName) {
        localStorage.setItem("token", user.token)
        setLogged(true)
      }
      setInitialCheckDone(true)
    }
    return () => {
      const storedItems = ["name", "surname", "id", "userName", "role", "area"];
      const isOnlyTokenPresent = storedItems.every(item => !localStorage.getItem(item));

      if (isOnlyTokenPresent) {
        localStorage.removeItem("token");
      }
    };
  }, [initialCheckDone, setLogged])

  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    if (user.role === "Administrador") {
      console.log("me conecto");

      const socket = new SockJS('http://localhost:8080/ws');
      const client = Stomp.over(socket);

      client.connect({}, (frame) => {
        console.log('Connected: ' + frame);
        setStompClient(client);

        client.subscribe('/topic/notifications', (message) => {
          playNotificationSound(); // Reproduce un sonido de notificación
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          notifyTicket(message.body + ` ${hours}:${minutes}:${seconds}`); // Muestra una notificación
        });
      }, (error) => {
        console.error('Error connecting to WebSocket server:', error);
        // Opcional: reintenta la conexión después de un tiempo
      });

      return () => {
        if (stompClient) {
          stompClient.disconnect(() => {
            console.log('Disconnected from WebSocket server');
          });
        }
      };
    }
  }, [user]);

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play();
  };

  if (!initialCheckDone) {
    return <div>Loading...</div>
  }

  return (
    <div className="App align-items-center d-flex flex-column flex-grow-1 bg-dark mv-100">
      <ToastContainer />
      <Routes>
        <Route element={(
          <>
            <NavBar />
            <Suspense>
              <Outlet />
            </Suspense>
          </>
        )}>
          <Route path="/home" element={isLogged ? user.role === "Administrador" ? <TicketReports /> : <Tickets /> : <Navigate to="/" />} />
          <Route path="/tickets" element={isLogged ? <Tickets /> : <Navigate to="/" />} />
          <Route path="/ticket/:ticketId" element={isLogged ? <TicketDetail /> : <Navigate to="/" />} />
          <Route path="/users" element={isLogged && user.role === "Administrador" ? <Users /> : <Navigate to="/" />} />
          <Route path="/ticketReports" element={isLogged && user.role === "Administrador" ? <TicketReports /> : <Navigate to="/" />} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App
