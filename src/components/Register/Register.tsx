import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useFormik } from 'formik';
import { notifySuccess } from '../../components/Toaster/Toaster';
import handleError from '../../utils/HandleErrors';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import type { createUserformValues } from '../../types';
import { axiosWithoutToken } from '../../utils/axiosInstances';
import { areas } from '../../utils/areas';
import { encryptPassword } from '../../utils/passwordHasher';
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface RegisterProps {
    updateList: () => void;
}

const Register: React.FC<RegisterProps> = ({updateList}) => {

    const [loading, setLoading] = useState<boolean>(false)
    const validate = (values: createUserformValues): createUserformValues => {
        const errors: any = {};

        if (!values.name.trim()) {
            errors.name = 'Ingrese el nombre';
        }

        if (!values.surname.trim()) {
            errors.surname = 'Ingrese el apellido';
        }

        if (!values.userName.trim()) {
            errors.userName = 'Ingrese el nombre de usuario';
        }

        if (!values.password.trim()) {
            errors.password = 'Ingrese la contraseña';
        }

        if (!values.repeatPassword.trim()) {
            errors.repeatPassword = 'Ingrese nuevamente la contraseña';
        } else if (values.repeatPassword !== values.password) {
            errors.repeatPassword = "Las contraseñas no coinciden";
        }
        if (!values.area) {
            errors.area = 'Elija un área';
        }
        if (!values.role) {
            errors.role = 'Elija un rol';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            name: "",
            surname: "",
            userName: "",
            password: "",
            repeatPassword: "",
            area: "",
            role: ""
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const createUser = {
                name: values.name,
                surname: values.surname,
                userName: values.userName.toLowerCase(),
                password: encryptPassword(values.password),
                area: values.area,
                role: values.role
            }
            let res
            try {
                res = await axiosWithoutToken.post(`${SERVER_URL}/api/v1/users/create`, createUser)
                notifySuccess(res.data)
                updateList()
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
            }
        },
    });

    const resetForm = () => {
        formik.resetForm();
    }

    return (
        <div className='container d-flex flex-column bg-dark-800'>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <h2 className="mb-5 text-light">Crear Usuario</h2>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.name && formik.errors.name)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Apellido</Form.Label>
                        <Form.Control type="text" placeholder="Apellido"
                            id="surname"
                            name="surname"
                            value={formik.values.surname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.surname && formik.errors.surname)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.surname}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Nombre de usuario</Form.Label>
                        <Form.Control placeholder="Nombre de usuario"
                            id="userName"
                            name="userName"
                            value={formik.values.userName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.userName && formik.errors.userName)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.userName}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Contraseña"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </Form.Group>
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Repetir contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Repetir contraseña"
                            id="repeatPassword"
                            name="repeatPassword"
                            value={formik.values.repeatPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.repeatPassword && formik.errors.repeatPassword)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.repeatPassword}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Área</Form.Label>
                        <Form.Select
                            id="area"
                            name="area"
                            value={formik.values.area}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.area && formik.errors.area)}
                        >
                            <option value="">Seleccionar...</option>
                            {areas.map((area) => 
                                <option key={area} value={area}>{area}</option>
                            )}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.area}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-5">
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Rol</Form.Label>
                        <Form.Select
                            id="role"
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={!!(formik.touched.role && formik.errors.role)}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="Usuario">Estandar</option>
                            <option value="Administrador">Administrador</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{formik.errors.role}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className='mb-3'>
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
        </div>
    )
}

export default Register