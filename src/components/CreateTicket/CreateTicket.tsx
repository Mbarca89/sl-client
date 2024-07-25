import { useRef, useState } from "react";
import { Form, Col, Row, Container, Button, Spinner } from "react-bootstrap"
import type { createTicketFormValues} from "../../types";
import { userData } from "../../types";
import { useFormik } from "formik";
import { axiosWithToken, axiosWithoutToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
import { notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import { userState } from "../../app/store";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateTicketProps {
    updateList: () => void
}

const CreateTicket: React.FC<CreateTicketProps> = ({ updateList }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useRecoilState(userState)
    const inputRef = useRef<HTMLInputElement>(null)
    const [image, setImage] = useState<File | null>(null);
    
    const validate = (values: createTicketFormValues): createTicketFormValues => {
        const errors: any = {};

        if (!values.title.trim()) {
            errors.title = 'Ingrese el título';
        }

        if (!values.description.trim()) {
            errors.description = 'Ingrese una descripción';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            type: "",
            image: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createTicket = {
                userId: user.id,
                userName: user.name + " " + user.surname,
                area: user.area,
                title: values.title,
                type: values.type,
                description: values.description
            }
            const formData = new FormData();
            if (image) formData.append('file', image);
            formData.append('ticket', JSON.stringify(createTicket));
            try {
                console.log(createTicket);
                
                const res = await axiosWithToken.post(`${SERVER_URL}/api/tickets/create`, formData)
                notifySuccess(res.data)
                updateList()
            } catch (error: any) {
                console.log(error);
                
                handleError(error)
            } finally {
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImage(event.target.files[0]);
        }
    };

    return (
        <Container className="text-light">
            <h2 className="mb-5 text-light">Nuevo ticket</h2>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <Row>
                    <Form.Group className="m-auto" as={Col} xs={12} md={6}>
                        <Form.Label>Título</Form.Label>
                        <Form.Control type="text"
                            placeholder="Título"
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.title && formik.errors.title)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.title}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group className="m-auto" as={Col} xs={12} md={6}>
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select
                            id="type"
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.type && formik.errors.type)}
                        >
                            <option>Seleccionar...</option>
                            <option value="Accesos">Accesos (Usuarios, contraseñas, cuentas)</option>
                            <option value="Hardware">Hardware (Monitor, teclado, mouse, impresora)</option>
                            <option value="Conectividad">Conectividad (Internet, red, carpetas compartidas)</option>
                            <option value="Software">Software (Errores, instalación)</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.type}</Form.Control.Feedback>
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
                            isInvalid={!!(formik.touched.description && formik.errors.description)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group className="mb-5 mt-5 m-auto" as={Col} xs={12} md={6}>
                        <Form.Label>Adjuntar captura (Opcional)</Form.Label>
                        <Form.Control type="file"
                            id="image"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            ref={inputRef}
                        />
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

export default CreateTicket