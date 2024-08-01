import { useEffect, useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import type { ticket } from "../../types";
import handleError from "../../utils/HandleErrors";
import { useParams } from "react-router-dom";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useRecoilState } from "recoil";
import { modalState, userState } from "../../app/store";
import CustomModal from "../../components/Modal/CustomModal";
import CloseTicket from "../../components/CloseTicket/CloseTicket";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const TicketDetail = () => {

    const { ticketId } = useParams()
    const [show, setShow] = useRecoilState(modalState)
    const [user, setUser] = useRecoilState(userState)
    const [loading, setLoading] = useState<boolean>(false)
    const [ticket, setTicket] = useState<ticket>({
        id: "",
        userId: "",
        userName: "",
        area: "",
        date: "",
        title: "",
        type: "",
        description: "",
        solution: "",
        solvedBy: "",
        solvedDate: "",
        image: "",
        closed: false
    })


    const getTicket = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/tickets/getTicket?ticketId=${ticketId}`)
            if (res.data) {
                console.log(res.data);

                setTicket(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            id: ticket.id,
            userId: ticket.userId,
            userName: ticket.userName,
            area: ticket.area,
            date: ticket.date,
            title: ticket.title,
            type: ticket.type,
            description: ticket.description,
            solution: ticket.solution,
            solvedBy: ticket.solvedBy,
            solvedDate: ticket.solvedDate,
            image: ticket.image,
            closed: ticket.closed
        },
        enableReinitialize: true,
        onSubmit: async values => {
            setLoading(true)

            try {
                console.log("nada");

            } catch (error: any) {
                console.log(error);

                handleError(error)
            } finally {
                setLoading(false)
            }
        },
    });

    const handleCloseTicket = () => {
        setShow(true)
    }

    useEffect(() => {
        getTicket()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketId])

    return (
        ticket.id && <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto text-light'>
            {!loading ? <>
                <div className="text-start bg-dark-700 rounded p-1">
                    <p><b>Fecha: </b>{ticket.date}</p>
                    <p><b>Título: </b>{ticket.title}</p>
                    <p><b>Área: </b>{ticket.area}</p>
                    <p><b>Usuario: </b>{ticket.userName}</p>
                    <p className={!ticket.closed ? "text-danger" : "text-success"}><b>Estado: </b>{!ticket.closed ? "Pendiente" : "Cerrado"}</p>
                    {ticket.closed && <p className={!ticket.closed ? "text-danger" : "text-success"}><b>Cerrado por: </b>{ticket.solvedBy}</p>}
                    {ticket.closed && <p className={!ticket.closed ? "text-danger" : "text-success"}><b>Cerrado el día: </b>{ticket.solvedDate}</p>}
                </div>
                <Form onSubmit={formik.handleSubmit} noValidate>
                    <Row>
                        <Form.Group className="m-auto" as={Col} xs={12} md={6}>
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control type="text"
                                placeholder="Título"
                                id="type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="m-auto" as={Col} xs={12} md={6}>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text"
                                placeholder="Descripción"
                                rows={10}
                                as={"textarea"}
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
                            />
                        </Form.Group>
                    </Row>
                    {ticket.image && <Row className="mb-2">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Form.Label>Imagen adjunta:</Form.Label>
                            <img className="w-50 mb-1" src={ticket.image ? `data:image/jpeg;base64,${ticket.image}` : "null"} alt="" />
                        </div>
                    </Row>}
                    {ticket.closed && <Row>
                        <Form.Group className="m-auto" as={Col} xs={12} md={6}>
                            <Form.Label>Solución</Form.Label>
                            <Form.Control type="text"
                                placeholder="solution"
                                rows={10}
                                as={"textarea"}
                                id="solution"
                                name="solution"
                                value={formik.values.solution}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled
                            />
                        </Form.Group>
                    </Row>}
                    <Row>
                        <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="danger" onClick={() => window.history.back()}>
                                    Volver
                                </Button>
                            </div>
                            {!ticket.closed && user.role === "Administrador" &&
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button className="" variant="primary" onClick={handleCloseTicket}>
                                        Cerrar ticket
                                    </Button>
                                </div>}
                        </Form.Group>
                    </Row>
                </Form>
            </> :
                <>
                    <Spinner></Spinner>
                </>}
            {show &&
                <CustomModal title="Cerrar Ticket">
                    <CloseTicket updateTicket={getTicket} ticketId={ticket.id}></CloseTicket>
                </CustomModal>}
        </div>
    )
}

export default TicketDetail