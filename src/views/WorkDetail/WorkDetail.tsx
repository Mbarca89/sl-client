import { useEffect, useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import type { work } from "../../types";
import handleError from "../../utils/HandleErrors";
import { useParams } from "react-router-dom";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { useRecoilState } from "recoil";
import { modalState, userState } from "../../app/store";
import CustomModal from "../../components/Modal/CustomModal";
import { notifySuccess } from "../../components/Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const WorkDetail = () => {

    const { workId } = useParams()
    const [show, setShow] = useRecoilState(modalState)
    const [user, setUser] = useRecoilState(userState)
    const [modal, setModal] = useState<string>("image")
    const [loading, setLoading] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [work, setWork] = useState<work>({
        id: "",
        userId: "",
        userName: "",
        date: "",
        title: "",
        description: "",
        image: ""
    })


    const getWork = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/work/getWork?workId=${workId}`)
            if (res.data) {
                setWork(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    const formik = useFormik({
        initialValues: {
            id: work.id,
            userId: work.userId,
            userName: work.userName,
            date: work.date,
            title: work.title,
            description: work.description,
            image: work.image
        },
        enableReinitialize: true,
        onSubmit: async values => {
            return null
        },
    });

    const handleImage = () => {
        setModal("image")
        setShow(true)
    }

    const handleEdit = async () => {
        if (edit) {
            const editWork = {
                id: formik.values.id,
                userId: formik.values.userId,
                userName: formik.values.userName,
                title: formik.values.title,
                description: formik.values.description,
            }
            const formData = new FormData();
            formData.append('work', JSON.stringify(editWork));
            try {
                const res = await axiosWithToken.put(`${SERVER_URL}/api/work/edit`, formData)
                if (res.data) {
                    notifySuccess(res.data)
                }
            } catch (error) {
                handleError(error)
            }
        }
        setEdit(!edit)
    }

    useEffect(() => {
        getWork()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workId])

    return (
        work.id && <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto text-light'>
            {!loading ? <>
                <div className="text-start bg-dark-700 rounded p-1">
                    <p><b>Fecha: </b>{work.date}</p>
                    <p><b>Título: </b>{work.title}</p>
                    <p><b>Usuario: </b>{work.userName}</p>
                </div>
                <Form noValidate>
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
                                disabled={!edit}
                            />
                        </Form.Group>
                    </Row>
                    {work.image && <Row className="mb-2">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <Form.Label>Imagen adjunta:</Form.Label>
                            <img role="button" onClick={handleImage} className="w-50 mb-1" src={work.image ? `data:image/jpeg;base64,${work.image}` : "null"} alt="" />
                        </div>
                    </Row>}
                    <Row>
                        <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="danger" onClick={() => window.history.back()}>
                                    Volver
                                </Button>
                            </div>
                            {`${user.name} ${user.surname}` === work.userName &&
                                <div className='d-flex align-items-center justify-content-center w-25'>
                                    <Button className="" variant="primary" onClick={handleEdit}>
                                        {!edit ? "Editar" : "Guardar"}
                                    </Button>
                                </div>}
                        </Form.Group>
                    </Row>
                </Form>
            </> :
                <>
                    <Spinner></Spinner>
                </>}
            {show && modal === "image" &&
                <CustomModal title="Imagen adjunta" fullscreen={true}>
                    <div className="d-flex justify-content-center">
                        <img className="w-100 mb-1" src={work.image ? `data:image/jpeg;base64,${work.image}` : "null"} alt="" />
                    </div>
                </CustomModal>}
        </div>
    )
}

export default WorkDetail