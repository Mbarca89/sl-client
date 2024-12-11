import './Home.css'
import ImportantTickets from '../../components/ImportantTickets/ImportantTickets'
import { useState } from 'react'
import { Nav } from 'react-bootstrap'

const Home = () => {

    const setTab = () => {
        setCurrentTab("important")
    }

    const [currentTab, setCurrentTab] = useState("important")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
        <Nav variant="tabs" defaultActiveKey="users" activeKey={currentTab}>
            <Nav.Item>
                <Nav.Link eventKey="important" onClick={() => setCurrentTab("important")}>Soluciones importantes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="myTickets" onClick={() => setCurrentTab("myTickets")}>Notas</Nav.Link>
            </Nav.Item>
        </Nav>
        <div className="mt-3">
            {currentTab === "important" ? <ImportantTickets /> : null}
            {/* {currentTab === "myClosedTickets" ? <ClosedByMeTickets /> : null}
            {currentTab === "newTicket" ? <CreateTicket updateList={setTab} /> : null} */}
        </div>
    </div>
    )
}

export default Home



