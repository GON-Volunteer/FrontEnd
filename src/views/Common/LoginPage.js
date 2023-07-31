import React from "react";

// css
import "../../assets/css/Login.css";

// reactstrap components
import { Button, Card, Form, Input, Container, Row, Col } from "reactstrap";

import '../../assets/css/Login.css';
// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";


function LoginPage() {
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("register-page");
    return function cleanup() {
      document.body.classList.remove("register-page");
    };
  });
  return (
    <>

      <div
          className="page-header"
                style={{
                  backgroundColor: "#ffffff",
                }}>
        <div className="filter" />
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" lg="4">
              <Card id = "login-card" className="card-register ml-auto mr-auto">
                <h3 id = "logintitle" className="title mx-auto">Creative Learners' Academy</h3>
                <img id="logoid" width = "180px" className="centered-img" src={require("assets/img/logo.png")} alt="logo" />
                <Form className="register-form">
                  <label>ID</label>
                  <Input placeholder="ID" type="text" />
                  <label>Password</label>
                  <Input placeholder="Password" type="password" />
                  <Button block className="btn-round" color="info">
                    Login
                  </Button>
                </Form>
                <div className="forgot">
                  <Button
                    className="btn-link"
                    color="danger"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot password?
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
        <div className="footer register-footer text-center">
          <h6>
            © {new Date().getFullYear()}, made by{" GON"}
            <i className="fa fa-heart heart" /> 
          </h6>
        </div>
      </div>
    </>
  );
}

export default LoginPage;