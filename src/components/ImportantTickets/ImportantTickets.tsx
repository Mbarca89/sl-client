import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ticket } from "../../types"
import { axiosWithToken } from "../../utils/axiosInstances"
import handleError from "../../utils/HandleErrors";
import { Table } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import CustomModal from "../Modal/CustomModal";
import RemoveFromImportant from "../RemoveFromImportant/RemoveFromImportant";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const ImportantTickets = () => {

    const navigate = useNavigate()
    const [tickets, setTickets] = useState<ticket[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [currentTicket, setCurrentTicket] = useState<string>("")
    const [show, setShow] = useRecoilState(modalState)

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

    const handleDelete = (id: string) => {
        setCurrentTicket(id)
        setShow(true)
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
                        <th>Quitar</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => <tr key={String(ticket.id)}>
                        <td  onClick={() => navigate(`/ticket/${ticket.id}`)}>{ticket.id}</td>
                        <td  onClick={() => navigate(`/ticket/${ticket.id}`)}>{ticket.date}</td>
                        <td  onClick={() => navigate(`/ticket/${ticket.id}`)}>{ticket.area}</td>
                        <td  onClick={() => navigate(`/ticket/${ticket.id}`)}>{ticket.title}</td>
                        <td onClick={() => handleDelete(ticket.id)}><svg width="25" height="25" viewBox="0 0 24 24" fill="#343C54" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                            <path d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z" fill="#343C54" />
                        </svg>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
            {show && <CustomModal title={"Quitar de importantes"}> 
                    <RemoveFromImportant id={currentTicket} updateList={getTickets}></RemoveFromImportant>
                </CustomModal>}
        </div>
    )
}

export default ImportantTickets