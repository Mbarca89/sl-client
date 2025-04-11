import { useEffect, useState } from "react";
import { work } from "../../types";
import { useNavigate } from "react-router-dom";
import { axiosWithToken } from "../../utils/axiosInstances";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import handleError from "../../utils/HandleErrors";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import CustomModal from "../Modal/CustomModal";
import CreateWork from "../CreateWork/CreateWork";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Works = () => {

    const [works, setWorks] = useState<work[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const currentDate = new Date();
    const dateStart = new Date()
    dateStart.setDate(currentDate.getDate() - 7)
    const [dates, setDate] = useState({
        dateStart: `${dateStart.getFullYear()}-${String(dateStart.getMonth() + 1).padStart(2, '0')}-${String(dateStart.getDate()).padStart(2, '0')}`,
        dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
    })
    const navigate = useNavigate()

    const getWorks = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<work[]>(`${SERVER_URL}/api/work/getFilteredWorks?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            if (res.data) {
                setWorks(res.data)
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
        getWorks()
    }

    const resetSearch = () => {
        setDate({
            dateStart: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate() - 7).padStart(2, '0')}`,
            dateEnd: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`,
        })
    }

    const downloadData = async () => {
        setLoading(true)
        try {
            const startDate = new Date(dates.dateStart);
            const endDate = new Date(dates.dateEnd);
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();
            const res = await axiosWithToken.get<work[]>(`${SERVER_URL}/api/work/downloadWorks?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
            if (res.data) {
                const formattedData = res.data.map((item) => ({
                    ID: item.id,
                    Fecha: item.date,
                    "Realizado por": item.userName,
                    Titulo: item.title,
                    Descripcion: item.description,
                }))
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Trabajos');

                // Definir columnas con encabezados personalizados y ancho
                worksheet.columns = [
                    { header: 'ID', key: 'ID', width: 10 },
                    { header: 'Fecha', key: 'Fecha', width: 20 },
                    { header: 'Realizado por', key: 'Realizado por', width: 30 },
                    { header: 'Titulo', key: 'Titulo', width: 30 },
                    { header: 'Descripcion', key: 'Descripcion', width: 40 },
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
                saveAs(blob, 'Trabajos.xlsx');
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getWorks()
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
                    <Col xs="auto" md={{offset:5}}>
                        <Button onClick={() => setShow(true)}>Nuevo +</Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Título</th>
                    </tr>
                </thead>
                <tbody>
                    {works.map(work => <tr key={String(work.id)} onClick={() => navigate(`/works/${work.id}`)} role="button">
                        <td>{work.id}</td>
                        <td>{work.date}</td>
                        <td>{work.title}</td>
                    </tr>)}
                </tbody>
            </Table>
            <Button onClick={downloadData}>Descargar</Button>
            {show && <CustomModal title="Nuevo trabajo realizado">
                <CreateWork updateList={getWorks}/>
                </CustomModal>}
        </div>
    )
}

export default Works