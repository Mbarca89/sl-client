import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ticket } from "../../types"
import { axiosWithToken } from "../../utils/axiosInstances"
import handleError from "../../utils/HandleErrors";
import { Table } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const ImportantTickets = () => {

    const navigate = useNavigate()
    const [tickets, setTickets] = useState<ticket[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getTickets = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get<ticket[]>(`${SERVER_URL}/api/tickets/getImportantTickets`)
            if (res.data) {
                setTickets(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTickets()
    }, [])


    return (
<div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
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

export default ImportantTickets