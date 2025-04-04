import { Button, Col, Form, Row, Table } from "react-bootstrap"
import type { ticket } from "../../types"
import { useEffect, useState } from "react"
import { axiosWithToken } from "../../utils/axiosInstances"
import handleError from "../../utils/HandleErrors";
import { areas } from "../../utils/areas";
import { useNavigate } from "react-router-dom";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const TicketReports = () => {

    const [tickets, setTickets] = useState<ticket[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const currentDate = new Date();
    const dateStart = new Date()
    dateStart.setDate(currentDate.getDate() - 7)
    const [dates, setDate] = useState({
        dateStart: `${dateStart.getFullYear()}-${String(dateStart.getMonth() + 1).padStart(2, '0')}-${String(dateStart.getDate()).padStart(2, '0')}`,
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

    const downloadData = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<ticket[]>(`${SERVER_URL}/api/tickets/downloadTickets?startDate=${formattedStartDate}&endDate=${formattedEndDate}&area=${area}&closed=${closed}`)
            if (res.data) {
                console.log(res.data)
                const formattedData = res.data.map((item) => ({
                    ID: item.id,
                    Fecha: item.date,
                    "Creado por": item.userName,
                    Titulo: item.title,
                    Descripcion: item.description,
                    Cerrado: item.closed ? "SI" : "NO",
                    "Fecha de cierre": item.solvedDate,
                    "Cerrado por": item.solvedBy,
                    Solucion: item.solution
                }))
                console.log(formattedData)
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Tickets');

                // Definir columnas con encabezados personalizados y ancho
                worksheet.columns = [
                    { header: 'ID', key: 'ID', width: 10 },
                    { header: 'Fecha', key: 'Fecha', width: 20 },
                    { header: 'Creado por', key: 'Creado por', width: 30 },
                    { header: 'Titulo', key: 'Titulo', width: 30 },
                    { header: 'Descripcion', key: 'Descripcion', width: 40 },
                    { header: 'Cerrado', key: 'Cerrado', width: 10 },
                    { header: 'Fecha de cierre', key: 'Fecha de cierre', width: 20 },
                    { header: 'Cerrado por', key: 'Cerrado por', width: 30 },
                    { header: 'Solucion', key: 'Solucion', width: 80 },
                ];

                // Agregar datos
                formattedData.forEach(item => {
                    worksheet.addRow(item);
                });

                // Estilo al encabezado
                worksheet.getRow(1).eachCell(cell => {
                    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF1F4E78' }, // azul oscuro
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });

                // Exportar el archivo
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                saveAs(blob, 'Tickets.xlsx');
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }

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
                    <Col xs={12} md={2}>
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
            <Button onClick={downloadData}>Descargar</Button>
        </div>
    )
}

export default TicketReports