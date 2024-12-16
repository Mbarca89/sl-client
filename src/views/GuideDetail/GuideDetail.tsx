import { useEffect, useState } from "react";
import { axiosWithToken } from "../../utils/axiosInstances";
import { guide } from "../../types";
import handleError from "../../utils/HandleErrors";
import { useNavigate, useParams } from "react-router-dom";
import HTMLRenderer from "../../utils/HTMLRenderer";
import { useRecoilState } from "recoil";
import { userState } from "../../app/store";
import { notifyError } from "../../components/Toaster/Toaster";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface HTMLRendererProps {
    htmlContent: string;
}

const GuideDetail = () => {

    const navigate = useNavigate()

    const { guideId } = useParams()
    const [user, setUser] = useRecoilState(userState)
    const [loading, setLoading] = useState<boolean>(false)
    const [guide, setGuide] = useState<guide>({
        id: "",
        title: "",
        guideText: "",
        adminOnly: false
    })

    const getGuide = async () => {
        setLoading(true)
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/guides/getById?id=${guideId}`)
            if (res.data) {
                if(res.data.adminOnly && user.role!== "Administrador") {
                    notifyError("Esta guia es solo para administradores")
                    navigate("/")
                }
                setGuide(res.data)
            }
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (guideId) {
            getGuide()
        }
    }, [])

    return (
        <div className="container text-light w-100">
            <h1>{guide.title}</h1>
            <HTMLRenderer htmlContent={guide.guideText} />
        </div>
    )
}

export default GuideDetail