import { useState } from "react"
import { Nav } from "react-bootstrap"
import CreateTicket from "../../components/CreateTicket/CreateTicket"
import UserTickets from "../../components/UserTickets/UserTickets"

const Tickets = () => {
    const setTab = () => {
        setCurrentTab("myTickets")
    }

    const [currentTab, setCurrentTab] = useState("newTicket")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="users" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="newTicket" onClick={() => setCurrentTab("newTicket")}>Nuevo Ticket</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="myTickets" onClick={() => setCurrentTab("myTickets")}>Mis Tickets</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab === "myTickets" ? <UserTickets /> : null}
                {currentTab === "newTicket" ? <CreateTicket updateList={setTab} /> : null}
            </div>
        </div>
    )
}

export default Tickets