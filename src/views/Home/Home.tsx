import './Home.css'
import ImportantTickets from '../../components/ImportantTickets/ImportantTickets'
import { useState } from 'react'
import { Nav } from 'react-bootstrap'
import TicketReports from '../TicketReports/TicketReports'
import Pending from '../../components/Pending/Pending'

const Home = () => {

    const setTab = () => {
        setCurrentTab("pending")
    }

    const [currentTab, setCurrentTab] = useState("pending")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
        <Nav variant="tabs" defaultActiveKey="users" activeKey={currentTab}>
        <Nav.Item>
                <Nav.Link eventKey="pending" onClick={() => setCurrentTab("pending")}>Pendientes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="tickets" onClick={() => setCurrentTab("tickets")}>Tickets</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="important" onClick={() => setCurrentTab("important")}>Soluciones importantes</Nav.Link>
            </Nav.Item>
        </Nav>
        <div className="mt-3">
            {currentTab === "tickets" ? <TicketReports /> : null}
            {currentTab === "important" ? <ImportantTickets /> : null}
            {currentTab === "pending" ? <Pending /> : null}
        </div>
    </div>
    )
}

export default Home



