import "./NavBar.css"
import { useRecoilState } from "recoil"
import { userState, logState } from "../../app/store"
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {

    const [user, setUser] = useRecoilState(userState)
    let [isLogged, setLogged] = useRecoilState(logState)
    const [expanded, setExpanded] = useState(false);

    const handleNavLinkClick = () => {
        setExpanded(false);
    };

    const navigate = useNavigate()

    const logOut = () => {
        setUser({
            id: "",
            name: "",
            surname: "",
            userName: "",
            role: "",
            area: "",
            token: ""
        })

        localStorage.clear()
        setLogged(false)
        navigate("/")
    }

    return (
        <Container fluid className="p-0">
            <Navbar expand="lg" className="bg-body-tertiary nav_bar text-light" expanded={expanded}>
                <Container>
                    <Navbar.Brand>SL+</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                    <Navbar.Collapse id="basic-navbar-nav text-light">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => { navigate("/home"); handleNavLinkClick() }}>Inicio</Nav.Link>
                            {user.role === "Administrador" && <NavDropdown title="Administrar" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { navigate("/users"); handleNavLinkClick() }}>Usuarios</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { navigate("/ticketReports"); handleNavLinkClick() }}>Tickets</NavDropdown.Item>
                            </NavDropdown>}
                            {user.role === "Administrador" && <Nav.Link onClick={() => { navigate("/tickets"); handleNavLinkClick() }}>Tickets</Nav.Link>}
                        </Nav>
                        <hr />
                        <Navbar.Text>
                            <NavDropdown title={`Bienvenido ${user.name}!`} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={()=>navigate("/user")}>Perfil</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item className="text-dark" onClick={logOut}>Salir</NavDropdown.Item>
                            </NavDropdown>
                        </Navbar.Text>
                        <Nav.Link>Salir</Nav.Link>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
}

export default NavBar