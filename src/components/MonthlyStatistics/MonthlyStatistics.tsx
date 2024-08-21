import { useEffect, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { axiosWithToken } from '../../utils/axiosInstances';
import type { statistics, ticket } from '../../types';
import handleError from '../../utils/HandleErrors';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { areas } from '../../utils/areas';
import Statistics from '../../views/Statistics/Statistics';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface graphData {
    name: string;
    Tickets: number;
}

const MonthlyStatistics = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const currentDate = new Date();
    const [dates, setDate] = useState({
        year: `${currentDate.getFullYear()}`,
        month: `${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
    });
    const [statistics, setStatistics] = useState<statistics>({
        ticketsPerArea: [],
        averageResponseTime: 0,
        todayTickets: 0,
        totalTickets: 0,
        ticketsByUser: [],  // Cambiado de {} a []
        ticketsByType: []   // Cambiado de {} a []
    });
    const [data, setData] = useState<graphData[]>(areas.map(area => (
        {
            name: area,
            Tickets: 0
        }
    )));

    const getTickets = async () => {
        setLoading(true);
        try {
            const startDate = new Date(Number(dates.year), Number(dates.month) - 1, 1);
            const endDate = new Date(Number(dates.year), Number(dates.month), 0);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<statistics>(`${SERVER_URL}/api/statistics/getStatistics?startDate=${formattedStartDate}&endDate=${formattedEndDate}&area=&closed=`);
            if (res.data) {
                // Crear el arreglo `ticketsPerArea` combinando las áreas predefinidas y los resultados del servidor
                const filledTicketsPerArea = areas.map(area => {
                    const serverData = res.data.ticketsPerArea.find(item => item.name === area);
                    return {
                        name: area,
                        count: serverData ? serverData.count : 0
                    };
                });
    
                // Mapear los datos para el gráfico
                const mappedData = filledTicketsPerArea.map(item => ({
                    name: item.name,
                    Tickets: item.count
                }));
    
                setData(mappedData);
                setStatistics({
                    ...res.data,
                    ticketsPerArea: filledTicketsPerArea
                });
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDates = (event: any) => {
        setDate({
            ...dates,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        getTickets();
    };

    useEffect(() => {
        getTickets();
    }, []);

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 text-light'>
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
                                <Form.Label column>Mes</Form.Label>
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
            <div className='w-100 text-dark' style={{ height: "500px" }}>
                <h3 className='text-light'>Tickets por área</h3>
                <ResponsiveContainer>
                    <BarChart
                        width={700}
                        height={1000}
                        data={data}
                        margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 30,
                        }}
                    >
                        <XAxis dataKey="name" scale="auto" angle={-45} height={100} tickMargin={35} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Tickets" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <hr />
            <div className='border rounded'>
                <p><b>Tickets del periodo consultado</b></p>
                <p>{statistics.totalTickets}</p>
                <p><b>Tickets de hoy {new Date().toLocaleDateString()}</b></p>
                <p>{statistics.todayTickets}</p>
                <p><b>Tiempo promedio de respuesta (En minutos)</b></p>
                <p>{statistics.averageResponseTime?.toFixed(2)}</p>
            </div>
        </div>
    )
}

export default MonthlyStatistics;
