import { useRef, useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import handleError from "../../utils/HandleErrors";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { guide } from "../../types";
import { title } from "process";
import { notifySuccess } from "../Toaster/Toaster";
import { useRecoilState } from "recoil";
import { modalState } from "../../app/store";
import React from "react";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface CreateGuideProps {
    updateList: () => void
}

const CreateGuide: React.FC<CreateGuideProps> = ({ updateList }) => {

    const quillRef = useRef<any>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useRecoilState(modalState)
    const [guideContent, setGuideContent] = useState<string>("")

    const handleImageUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axiosWithToken.post(`${SERVER_URL}/api/images/upload`, formData);
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", response.data.url);
            }
        } catch (error) {
            handleError(error)
        }
    };

    const validate = (values: guide): guide => {
        const errors: any = {};
        if (!values.title.trim()) {
            errors.title = 'Ingrese el título';
        } else if (!/^.{0,49}$/.test(values.title)) {
            errors.title = "El título es demasiado largo"
        }
        if (!values.guideText.trim()) {
            errors.guideText = 'Escriba el contenido de la guia';
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            id: "",
            title: "",
            guideText: "",
            adminOnly: false,
        },
        validate,
        onSubmit: async values => {
            setLoading(true)
            const processedContent = await processImages(values.guideText);
            const createGuide = {
                title: values.title,
                guideText: processedContent,
                adminOnly: values.adminOnly
            }
            try {
                const res = await axiosWithToken.post(`${SERVER_URL}/api/guides/create`, createGuide)
                notifySuccess(res.data)
                updateList()
                setShow(false)
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

    const processImages = async (content: string): Promise<string> => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const images = doc.querySelectorAll("img");

        for (const img of images) {
            if (img.src.startsWith("data:image")) {
                try {
                    // Convierte la imagen Base64 en un blob
                    const response = await fetch(img.src);
                    const blob = await response.blob();
                    const file = new File([blob], "image.jpg", { type: blob.type });

                    // Sube la imagen al servidor
                    const formData = new FormData();
                    formData.append("image", file);
                    const uploadResponse = await axiosWithToken.post(`${SERVER_URL}/api/images/upload`, formData);

                    // Reemplaza el src de la imagen con la URL devuelta
                    img.src = uploadResponse.data.url;
                } catch (error) {
                    handleError(error)
                }
            }
        }

        return doc.body.innerHTML; // Devuelve el contenido actualizado
    };

    return (
        <div className="d-flex flex-grow-1 w-100">
            <Form className="w-100" noValidate onSubmit={formik.handleSubmit}>
                <Row>
                    <Form.Group className="m-auto" as={Col} xs={12} md={12}>
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
                <Row className="mb-5 w-100">
                    <Form.Label>Contenido</Form.Label>
                    <ReactQuill
                        ref={quillRef}
                        style={{ height: '300px', width: "100%" }}
                        modules={{
                            toolbar: {
                                container: [
                                    ["bold", "italic", "underline"],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    [{ direction: "rtl" }],
                                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                    ["image"], 
                                ]
                            },
                        }}
                        value={formik.values.guideText}
                        onChange={value => formik.setFieldValue("guideText", value)}
                    />
                </Row>
                <Row className="mt-3">
                    <Form.Group as={Row} className="d-flex align-items-center justify-content-center">
                        <Col lg={1}>
                            <Form.Check
                                type="switch"
                                id="adminOnly"
                                checked={formik.values.adminOnly}
                                onChange={e => formik.setFieldValue("adminOnly", e.target.checked)}
                                onBlur={formik.handleBlur}
                            />
                        </Col>
                        <Form.Label column>
                            Solo para administradores
                        </Form.Label>
                    </Form.Group>
                </Row>
                <Row className="mt-5">
                    <Form.Group as={Col} className="d-flex justify-content-center mt-3">
                        <div className='d-flex align-items-center justify-content-center w-25'>
                            <Button className="" variant="danger" onClick={() => setShow(false)}>
                                Cancelar
                            </Button>
                        </div>
                        {!loading ?
                            <div className='d-flex align-items-center justify-content-center w-25'>
                                <Button className="" variant="primary" type="submit">
                                    Crear
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


export default CreateGuide