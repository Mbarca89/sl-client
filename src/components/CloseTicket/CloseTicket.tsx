import { useFormik } from "formik";
import type { closeTicketFormValues } from "../../types";
import { useRecoilState } from "recoil";
import { modalState, userState } from "../../app/store";
import { useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifySuccess } from "../Toaster/Toaster";
import handleError from "../../utils/HandleErrors";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CloseTicketProps {
    updateTicket: () => void
    ticketId: string
}

const CloseTicket: React.FC<CloseTicketProps> = ({ updateTicket, ticketId }) => {

    const [show, setShow] = useRecoilState(modalState)
    const [user, setUser] = useRecoilState(userState)
    const [loading, setLoading] = useState<boolean>(false)

    const validate = (values: closeTicketFormValues): closeTicketFormValues => {
        const errors: any = {};

        if (!values.solution.trim()) {
            errors.solution = 'Ingrese la solución brindada';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            solution: "",
            solvedBy: "",
            closed: false,
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const closeTicket = {
                id: ticketId,
                solution: values.solution,
                solvedBy: user.name + " " + user.surname,
                closed: true
            }
            
            try {
                const res = await axiosWithToken.put(`${SERVER_URL}/api/tickets/close`, closeTicket)
                notifySuccess(res.data)
                updateTicket()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
                setShow(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
    }

    return (
        <div>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row>
                    <Form.Group className="m-auto" as={Col} xs={12} md={12}>
                        <Form.Label>Solución</Form.Label>
                        <Form.Control type="text"
                            placeholder="Solución"
                            rows={10}
                            as={"textarea"}
                            id="solution"
                            name="solution"
                            value={formik.values.solution}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.solution && formik.errors.solution)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.solution}</Form.Control.Feedback>

                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={() => setShow(false)}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Cerrar ticket
                                </Button>
                            </div> :
                            <Spinner></Spinner>
                        }
                    </Form.Group>
                </Row>
            </Form>
        </div>
    )
}

export default CloseTicket