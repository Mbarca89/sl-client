import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { userState } from "../../app/store"
import type { createUserformValues, userData } from "../../types";
import handleError from "../../utils/HandleErrors";
import { axiosWithToken } from "../../utils/axiosInstances";
import { notifySuccess } from "../../components/Toaster/Toaster";
import { encryptPassword } from "../../utils/passwordHasher";
import { useFormik } from "formik";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const UserDetail = () => {

    const [user, setUser] = useRecoilState(userState)
    const [loading, setLoading] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [userDetail, setUserDetail] = useState<userData>({
        id: "",
        name: "",
        surname: "",
        userName: "",
        password: "",
        area: "",
        role: ""
    })

    const getUser = async (userName: string) => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get<userData>(`${SERVER_URL}/api/v1/users/getUserByName/${userName}`)
            if (res.data) {
                setUserDetail(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

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
            id: userDetail.id,
            name: userDetail.name,
            surname: userDetail.surname,
            userName: userDetail.userName,
            password: "",
            repeatPassword: "",
            area: userDetail.area,
            role: userDetail.role
        },
        validate,
        enableReinitialize: true,
        onSubmit: async (values) => {
            setLoading(true)
            const editUser = {
                id: user.id,
                name: values.name,
                surname: values.surname,
                userName: values.userName.toLowerCase(),
                password: encryptPassword(values.password),
                area: values.area,
                role: values.role
            }
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/v1/users/edit`, editUser)
                notifySuccess(res.data)
            } catch (error: any) {
                handleError(error)
            } finally {
                setLoading(false)
                setEdit(false)
            }
        },
    });

    const handlePassword = () => {
        setEdit(!edit)
    }

    useEffect(() => {
        if (user.userName) {
            getUser(user.userName)
        }
    }, [user])

    return (
        <div className='container d-flex flex-column bg-dark-800'>
            <Form onSubmit={formik.handleSubmit} noValidate>
                <h2 className="mb-5 text-light">{userDetail.name} {userDetail.surname}</h2>
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
                </Row>
                <Row>
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
                        <Form.Label className='text-light'>Área</Form.Label>
                        <Form.Control placeholder="Nombre de usuario"
                            id="area"
                            name="area"
                            value={formik.values.area}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled
                        />
                    </Form.Group>
                </Row>
                <hr />
                <h3 onClick={handlePassword} role="button" className="text-light">Cambiar contraseña <svg width="25" height="25" viewBox="0 0 512 512" style={{ color: "#ffffff" }} xmlns="http://www.w3.org/2000/svg" className="h-full w-full"><rect width="512" height="512" x="0" y="0" rx="30" fill="transparent" stroke="transparent" stroke-width="0" stroke-opacity="100%" paint-order="stroke"></rect><svg width="512px" height="512px" viewBox="0 0 1024 1024" fill="#ffffff" x="0" y="0" role="img" style={{ display: "inline-block;vertical-align:middle" }} xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff"><path fill="currentColor" d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3l-362.7 362.6l-88.9 15.7l15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" /></g></svg></svg></h3>
                <Row className="mb-2">
                    <Form.Group as={Col} xs={12} lg={6}>
                        <Form.Label className='text-light'>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Contraseña"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={!edit}
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
                            disabled={!edit}
                            isInvalid={!!(formik.touched.repeatPassword && formik.errors.repeatPassword)}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.repeatPassword}</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {edit && <Row className='mb-3'>
                    <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={handlePassword}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Guardar
                                </Button>
                            </div> :
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Spinner />
                            </div>}
                    </Form.Group>
                </Row>}
            </Form>
        </div>
    )
}

export default UserDetail