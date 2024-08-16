import { Button, Col, Form, Row, Table } from "react-bootstrap"
import type { ticket } from "../../types"
import { useEffect, useState } from "react"
import { axiosWithToken } from "../../utils/axiosInstances"
import handleError from "../../utils/HandleErrors";
import { areas } from "../../utils/areas";
import { useNavigate } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const TicketReports = () => {

    const [tickets, setTickets] = useState<ticket[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const currentDate = new Date();
    const [dates, setDate] = useState({
        dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate() -7).padStart(2, '0')}`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })
    const [area, setArea] = useState<string>("")
    const [closed, setClosed] = useState<string>("")
    const navigate = useNavigate()

    const getTickets = async () => {
        setLoading(true)  
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();                      
            const res = await axiosWithToken.get<ticket[]>(`${SERVER_URL}/api/tickets/getFilteredTickets?startDate=${formattedStartDate}&endDate=${formattedEndDate}&area=${area}&closed=${closed}`)
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

    const handleArea = (event: any) => {
        setArea(event.target.value)
    }

    const handleClosed = (event: any) => {
        setClosed(event.target.value)
    }

    const resetSearch = () => {
            setDate({
                dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate() - 7).padStart(2, '0')}`,
                dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
            })
            setArea("")
    }

    useEffect(() => {
        if (area === "") {
            getTickets();
        }
    }, [area]);

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
                    <Col  xs={12} md={2}>
                        <Form.Group>
                            <Col>
                                <Form.Select
                                    value={area}
                                    onChange={handleArea}
                                >
                                    <option value="">Área...</option>
                                    {areas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={2}>
                        <Form.Group>
                            <Col>
                                <Form.Select
                                    value={closed}
                                    onChange={handleClosed}
                                >
                                    <option value="">Todos</option>
                                    <option value="false">Pendinte</option>
                                    <option value="true">Cerrado</option>      
                                </Form.Select>
                            </Col>
                        </Form.Group>
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
                    {tickets.map(ticket => <tr key={String(ticket.id)} onClick={() => navigate(`/ticket/${ticket.id}`)} role="button">
                        <td>{ticket.id}</td>
                        <td>{ticket.date}</td>
                        <td>{ticket.area}</td>
                        <td>{ticket.title}</td>
                        <td className={!ticket.closed ? "bg-danger" : "bg-success"}>{ticket.closed ? "Cerrado" : "Pendiente"}</td>
                    </tr>)}
                </tbody>
            </Table>
        </div>
    )
}

export default TicketReports