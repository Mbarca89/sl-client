import './Home.css'
import ImportantTickets from '../../components/ImportantTickets/ImportantTickets'
import { useEffect, useState } from 'react'
import { Nav } from 'react-bootstrap'
import TicketReports from '../TicketReports/TicketReports'
import Pending from '../../components/Pending/Pending'
import Works from '../../components/Works/Works'
import { useNavigate, useParams } from 'react-router-dom'

const Home = () => {

    const {tab} = useParams()
    const navigate = useNavigate()

    const handleTabChange = (nextTab:string) => {
        navigate(`/home/${nextTab}`)
    }

    const [currentTab, setCurrentTab] = useState(tab)

    useEffect(() => {
        setCurrentTab(tab)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="users" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="tickets" onClick={() => handleTabChange("tickets")}>Tickets</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="works" onClick={() => handleTabChange("works")}>Trabajos realizados</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="pending" onClick={() => handleTabChange("pending")}>Pendientes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="important" onClick={() => handleTabChange("important")}>Soluciones importantes</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab === "tickets" ? <TicketReports /> : null}
                {currentTab === "works" ? <Works /> : null}
                {currentTab === "important" ? <ImportantTickets /> : null}
                {currentTab === "pending" ? <Pending /> : null}
            </div>
        </div>
    )
}

export default Home



