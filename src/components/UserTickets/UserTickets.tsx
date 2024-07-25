import { Button, Col, Form, Row, Table } from "react-bootstrap"
import type { ticket } from "../../types"
import { useEffect, useState } from "react"
import { axiosWithToken } from "../../utils/axiosInstances"
import handleError from "../../utils/HandleErrors";
import { useRecoilState } from "recoil";
import { userState } from "../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const TicketList = () => {

    const [tickets, setTickets] = useState<ticket[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useRecoilState(userState)
    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })

    const getTickets = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();    
            const res = await axiosWithToken.get<ticket[]>(`${SERVER_URL}/api/tickets/getUserTickets?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${user.id}`)
            if (res.data) {
                setTickets(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDates = (event: any) => {
        setDate({
            ...dates,
            [event.target.name]: event.target.value
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getTickets()
    }

    const resetSearch = () => {
        setDate({
            dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
            dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        })
    }

    useEffect(() => {
        getTickets()
    }, [])

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="date"
                            placeholder="Buscar"
                            name="dateStart"
                            className=""
                            onChange={handleDates}
                            value={String(dates.dateStart)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Form.Control
                            type="date"
                            placeholder="Buscar"
                            name="dateEnd"
                            className=""
                            onChange={handleDates}
                            value={String(dates.dateEnd)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit">Buscar</Button>
                    </Col>
                    <Col xs="auto">
                        <Button onClick={resetSearch}>Resetear</Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Área</th>
                        <th>Título</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => <tr key={String(ticket.id)}>
                        <td>{ticket.id}</td>
                        <td>{ticket.date}</td>
                        <td>{ticket.area}</td>
                        <td>{ticket.title}</td>
                        <td>{ticket.closed ? "Cerrado" : "Pendiente"}</td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    )
}

export default TicketList