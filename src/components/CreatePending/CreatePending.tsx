import { useFormik } from "formik";
import { useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifySuccess } from "../Toaster/Toaster";
import handleError from "../../utils/HandleErrors";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreatePendingProps {
    updateList:() => void
}

const CreatePending:React.FC<CreatePendingProps> = ({updateList}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    
    const validate = (values:any) => {
        const errors: any = {};

        if (!values.notes.trim()) {
            errors.notes = 'Ingrese una nota';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            notes: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/pending/create`, {notes: values.notes})
                notifySuccess(res.data)
                updateList()
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
        <Container className="text-dark">
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row>
                    <Form.Group className="m-auto" as={Col} xs={12} md={12}>
                        <Form.Label>Tarea</Form.Label>
                        <Form.Control type="text"
                        as="textarea"
                            placeholder="..."
                            id="notes"
                            name="notes"
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.notes && formik.errors.notes)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.notes}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                    <div className='d-flex align-items-center justify-content-center w-25'>
                        <Button className="" variant="danger" onClick={resetForm}>
                            Reiniciar
                        </Button>
                    </div>
                    {!loading ?
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="primary" type="submit">
                                Crear
                            </Button>
                        </div> :
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Spinner />
                        </div>}
                </Form.Group>
            </Row>
            </Form>
        </Container>
    )
}

export default CreatePending