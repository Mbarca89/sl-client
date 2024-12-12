import { useEffect, useState } from "react"
import { pending } from "../../types"
import { useRecoilState } from "recoil"
import { modalState } from "../../app/store"
import { axiosWithToken } from "../../utils/axiosInstances";
import handleError from "../../utils/HandleErrors";
import CustomModal from "../Modal/CustomModal";
import CreatePending from "../CreatePending/CreatePending";
import DeletePending from "../DeletePending/DeletePending";
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Pending = () => {

    const [pendings, setPendings] = useState<pending[]>([])
    const [show, setShow] = useRecoilState(modalState)
    const [modal, setModal] = useState<string>("")
    const [currentPending, setCurrentPending] = useState<string>("")

    const getPendings = async () => {
        try {
            const res = await axiosWithToken.get(`${SERVER_URL}/api/pending/getAll`)
            if (res.data) {
                setPendings(res.data)
            }
        } catch (error) {
            handleError(error)
        }
    }

    const handleCreate = () => {
        setModal("create")
        setShow(true)
    }

    const handleDelete = (id: string) => {
        setCurrentPending(id)
        setModal("delete")
        setShow(true)
    }

    useEffect(() => {
        getPendings()
    }, [])

    return (
        <div className='container text-light flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <div onClick={handleCreate} role="button" className="d-flex justify-content-start align-items-center">
                <p className="m-0">Agregar</p>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                    <path d="M11.2502 6C11.2502 5.58579 11.586 5.25 12.0002 5.25C12.4145 5.25 12.7502 5.58579 12.7502 6V11.2502H18.0007C18.4149 11.2502 18.7507 11.586 18.7507 12.0002C18.7507 12.4145 18.4149 12.7502 18.0007 12.7502H12.7502V18.0007C12.7502 18.4149 12.4145 18.7507 12.0002 18.7507C11.586 18.7507 11.2502 18.4149 11.2502 18.0007V12.7502H6C5.58579 12.7502 5.25 12.4145 5.25 12.0002C5.25 11.586 5.58579 11.2502 6 11.2502H11.2502V6Z" fill="#ffffff" />
                </svg>

            </div>
            {pendings.length ?
                <div className="d-flex flex-column gap-3 w-100 mt-3">
                    {pendings.map((pending) => (
                        <div className="w-100 bg-light border rounded text-dark text-start position-relative p-1">
                            <div className="position-absolute end-0" role="button" onClick={() => handleDelete(pending.id)}>
                                <svg width="25" height="25" viewBox="0 0 24 24" fill="#343C54" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                                    <path d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z" fill="#343C54" />
                                </svg>
                            </div>
                            <div>
                                <p>Fecha y hora: {new Date(pending.pendingDate).toLocaleString()}</p>
                            </div>
                            <hr />
                            {pending.notes.replaceAll("+", " ")}
                            <hr />
                        </div>
                    ))}
                </div> :
                <div>
                    <h1>No hay tareas pendientes</h1>
                </div>}
            {show && modal === "create" &&
                <CustomModal title={"Agregar tarea pendiente"}>
                    <CreatePending updateList={getPendings} />
                </CustomModal>
            }
            {show && modal === "delete" &&
                <CustomModal title={"Eliminar tarea pendiente"}>
                    <DeletePending updateList={getPendings} id={currentPending}/>
                </CustomModal>
            }
        </div>
    )
}

export default Pending