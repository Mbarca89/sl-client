import "./MonthlyReport.css"
import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap"
import type { statistics } from "../../types";
import { axiosWithToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
import { areas } from "../../utils/areas";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from "../../assets/logook.webp"
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const MonthlyReport = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const pdfTemplateRef = useRef<HTMLDivElement | null>(null);
    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    })
    const [statistics, setStatistics] = useState<statistics>({
        ticketsPerArea: {},
        averageResponseTime: 0,
        todayTickets: 0,
        totalTickets: 0,
        ticketsByUser: {},
        ticketsByType: {}
    })

    const generateAndDownloadPdf = async () => {
        if (!pdfTemplateRef.current) return;

        setLoading(true);

        const input = pdfTemplateRef.current;

        try {
            const scale = 1.5;
            const canvas = await html2canvas(input, { scale });
            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 1;

            const contentWidth = 210;
            const contentHeight = 297;
            const pdfScale = Math.min((pdfWidth - margin * 2) / contentWidth, (pdfHeight - margin * 2) / contentHeight);

            const scaledWidth = contentWidth * pdfScale;
            const scaledHeight = contentHeight * pdfScale;

            const xOffset = margin;
            const yOffset = margin;

            pdf.addImage(imgData, 'JPEG', xOffset, yOffset, scaledWidth, scaledHeight);

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `Reporte ${new Date(Number(dates.year), Number(dates.month) - 1, 1).toLocaleDateString()} - ${new Date(Number(dates.year), Number(dates.month), 0).toLocaleDateString()} .pdf`;
            link.click();

            URL.revokeObjectURL(pdfUrl);
        } catch (error: any) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const getTickets = async () => {
        setLoading(true)
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1)
            const endDate = new Date(Number(dates.year), Number(dates.month), 0)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<statistics>(`${SERVER_URL}/api/statistics/getStatistics?startDate=${formattedStartDate}&endDate=${formattedEndDate}&area=&closed=`)
            if (res.data) {
                const filledTicketsPerArea = { ...res.data.ticketsPerArea };
                areas.forEach(area => {
                    if (!(area in filledTicketsPerArea)) {
                        filledTicketsPerArea[area] = 0;
                    }
                });
                setStatistics({
                    ...res.data,
                    ticketsPerArea: filledTicketsPerArea
                });
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
        })
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()
        getTickets()
    }

    useEffect(() => {
        getTickets()
    }, [])

    return (
        !loading ? <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 text-light'>
            <div>
                <Form onSubmit={handleSubmit}>
                    <Row className='d-flex flex-lg-row flex-column justify-content-center'>
                        <Col xs={10} lg={4}>
                            <Form.Group className="mb-3" as={Row} xs={12} lg={12}>
                                <Form.Label column>Año</Form.Label>
                                <Col>
                                    <Form.Control
                                        type='number'
                                        id="year"
                                        name="year"
                                        value={dates.year}
                                        onChange={(handleDates)}
                                    />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs={10} lg={4}>
                            <Form.Group className="mb-3" as={Row} xs={12}>
                                <Form.Label column >Mes</Form.Label>
                                <Col>
                                    <Form.Select
                                        id="month"
                                        name="month"
                                        onChange={(handleDates)}
                                        value={dates.month}
                                    >
                                        <option value="01">01 - Enero</option>
                                        <option value="02">02 - Febrero</option>
                                        <option value="03">03 - Marzo</option>
                                        <option value="04">04 - Abril</option>
                                        <option value="05">05 - Mayo</option>
                                        <option value="06">06 - Junio</option>
                                        <option value="07">07 - Julio</option>
                                        <option value="08">08 - Agosto</option>
                                        <option value="09">09 - Septiembre</option>
                                        <option value="10">10 - Octubre</option>
                                        <option value="11">11 - Noviembre</option>
                                        <option value="12">12 - Diciembre</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Buscar</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <hr />
            <div className="text-start text-dark pdf-template" ref={pdfTemplateRef}>
                <div className="d-flex justify-content-center">
                    <img className="w-50 align-items-center" src="/images/sl+logonegro.png" alt="SL+" />
                </div>
                <h5 className="text-center">{`Reporte correspondiente al período: ${new Date(Number(dates.year), Number(dates.month) - 1, 1).toLocaleDateString()} - ${new Date(Number(dates.year), Number(dates.month), 0).toLocaleDateString()}`}</h5>
                <hr />
                <h6>Tickets por area:</h6>
                <div className="text-start">
                    <p>{Object.entries(statistics.ticketsPerArea).map(([area, count]) => (
                        <li key={area}>{area}: {count}</li>
                    ))}</p>

                </div>
                <hr />
                <h6>Tickets del período:</h6>
                <p>{statistics.totalTickets}</p>
                <h6>Tiempo de respuesta promedio (En minutos):</h6>
                <p>{statistics.averageResponseTime.toFixed(2)}</p>
                <hr />
                <h6>Problemas mas frecuentes:</h6>
                <div className="text-start">
                    <p>{Object.entries(statistics.ticketsByType).map(([type, count]) => (
                        <li key={type}>{type}: {count}</li>
                    ))}</p>

                </div>
                <hr />
                <h6>Usuarios con mas tickets creados:</h6>
                <div className="text-start">
                    <p>{Object.entries(statistics.ticketsByUser).map(([user, count]) => (
                        <li key={user}>{user}: {count}</li>
                    ))}</p>

                </div>
            </div>
            <Button className="w-50 mt-5" onClick={generateAndDownloadPdf}>{!loading ? "Descargar" : <Spinner />}</Button>
        </div> :
            <Spinner></Spinner>
    )
}

export default MonthlyReport