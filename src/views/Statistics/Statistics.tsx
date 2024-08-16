import { useState } from "react"
import { Nav } from "react-bootstrap"
import MonthlyStatistics from "../../components/MonthlyStatistics/MonthlyStatistics"
import MonthlyReport from "../../components/MonthlyReport/MonthlyReport"

const Statistics = () => {
    const setTab = () => {
        setCurrentTab("monthlyStatistics")
    }

    const [currentTab, setCurrentTab] = useState("monthlyStatistics")

    return (
        <div className='container flex-grow-1 p-lg-3 p-sm-0 rounded bg-dark-800 m-2 overflow-auto'>
            <Nav variant="tabs" defaultActiveKey="users" activeKey={currentTab}>
                <Nav.Item>
                    <Nav.Link eventKey="monthlyStatistics" onClick={() => setCurrentTab("monthlyStatistics")}>Estadísticas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="monthlyReport" onClick={() => setCurrentTab("monthlyReport")}>Reporte</Nav.Link>
                </Nav.Item>
            </Nav>
            <div className="mt-3">
                {currentTab === "monthlyStatistics" ? <MonthlyStatistics /> : null}
                {currentTab === "monthlyReport" ? <MonthlyReport /> : null}
            </div>
        </div>
    )
}

export default Statistics