import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  CardFooter,
  Row,
  Col,
} from "reactstrap";
import { checkEmail } from "../services/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "components/Headers/Header";

function AddNew() {
  const [showNotification, setShowNotification] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [agencies, setAgencies] = useState([]);

  const countries = ["Tunis","Sfax","Sousse","Gabès","Nabeul","Monastir","Bizerte","Gafsa","Kairouan","Tozeur","Djerba"];

  function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  useEffect(() => {
    //if (getCookie("role") !== "admin") window.location.href = "/auth/login";
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getallagences");
        setAgencies(response.data.agences);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const pageSize = 5;
  const pageCount = Math.ceil(agencies.length / pageSize);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const paginatedUsers = agencies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const last_name = form.last_name.value;
    const first_name = form.first_name.value;
    const address = form.address.value;

    const verified = true;
    const phone_number = form.phone_number.value
      ? "+216" + form.phone_number.value
      : "";

    if (
      !email ||
      !last_name ||
      !first_name ||
      !address||

      !verified
    ) {
      setShowNotification(false);
      setShowVerifyEmail(false);
      setErrors({});
      setShowError(true);
      setErrors({
        ...errors,
        message: "Please fill in at least one field except phone number",
      });
      return;
    }

    try {
      // Check if email is already in use
      console.log(email);
      const checkEmailRes = await checkEmail(email);
      if (checkEmailRes) {
        setShowNotification(true);
        setShowVerifyEmail(false);
        setShowError(false);
        setErrors({ ...errors, email: "Email already in use" }); // Display error message
        return;
      }
      console.log("out");
      const verif1 = "true";
      // Register user
      const add = await axios.post(
        "http://localhost:5000/add",
        {
          email,
          password : email,
          last_name,
          first_name,
          role: "Agence",
          verif1,
          phone_number,
          address,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // handle response
      if (add.status === 201) {
        setShowNotification(true);
        setShowVerifyEmail(true);
        setErrors({});
        setShowError(false);
        window.location.replace("http://localhost:3000/admin/listOfagency");
      } else {
        setShowNotification(false);
        setShowVerifyEmail(false);
        setErrors({ ...errors, message: "Signup failed" });
        setShowError(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validateFirstName = (first_name) => {
    const first_nameRegex = /^[a-zA-Z\s\-'\u00C0-\u024F"]+$/;
    return first_nameRegex.test(first_name);
  };

  const validateLastName = (last_name) => {
    const lastNameRegex = /^[a-zA-Z0-9\s\-'\u00C0-\u024F"]{3,20}$/;
    return lastNameRegex.test(last_name);
  };
  const validateAddress = (address) => {
    const addressRegex = /^[a-zA-Z0-9\s\-'\u00C0-\u024F"]+$/;
    return addressRegex.test(address);
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    const emailError = document.querySelector(".email.error");

    let errorMessage = "";
    if (!validateEmail(email)) {
      errorMessage +=
        "&#10060; <span class='error-text'>Please enter a valid email address.</span> ";
    } else {
      errorMessage +=
        "&#9989; <span class='success-text'>Email address is valid.</span> ";
    }

    emailError.innerHTML = errorMessage;
  };

 

  const validatePhoneNumber = (phone_number) => {
    const phone_numberRegex = /^(?:\+216|00216|0)?[1-9]\d{7}$/;
    return phone_numberRegex.test(phone_number);
  };

  const handlePhoneNumberChange = (e) => {
    const phone_number = e.target.value;
    const phone_numberError = document.querySelector(".phone_number.error");
    if (!validatePhoneNumber(phone_number)) {
      phone_numberError.textContent = "Please enter a valid Tunisian phone number";
    } else {
      phone_numberError.textContent = "Phone number is correct";
    }
  };


  const handleFirstNameChange = (e) => {
    const first_name = e.target.value;
    const first_nameError = document.querySelector(".first_name.error");
    if (!validateFirstName(first_name)) {
      first_nameError.textContent = "Please enter the name of the agency .";
    } else {
      first_nameError.textContent = "";
    }
  };

  const handleLastNameChange = (e) => {
    const last_name = e.target.value;
    const last_nameError = document.querySelector(".last_name.error");
    if (!validateLastName(last_name)) {
      last_nameError.textContent =
        "Please enter the Branche Of The Agency.";
    } else {
      last_nameError.textContent = "";
    }
  };
  const handleAddressChange = (e) => {
    const address = e.target.value;
    const addressError = document.querySelector(".address.error");
    if (!validateAddress(address)) {
      addressError.textContent = "Please enter a valid address .";
    } else {
      addressError.textContent = "";
    }
  };

  return (
    <>
      <Header />
      <div className="content">
        <Row>
          <Col md="8" className="mx-auto">
            <Card className="card-user">
              <CardHeader>
                <h5 className="title">Add Agence</h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit} noValidate>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Agency Name</label>
                        <Input
                          name="first_name"
                          type="text"
                          placeholder="Agency Name"
                          required
                          onChange={handleFirstNameChange}
                        />
                        <div className="first_name error"></div>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Branche</label>
                        <Input
                          name="last_name"
                          type="text"
                          placeholder="Branche Address"
                          required
                          onChange={handleLastNameChange}
                        />
                          
                        <div className="last_name error"></div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          name="address"
                          type="address"
                          placeholder="Address"
                          required
                          onChange={handleAddressChange}
                        />
                        <div className="address error"></div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Email"
                          required
                          onChange={handleEmailChange}
                        />
                        <div className="email error"></div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <label className="phone_number">
                      Phone number (+216){" "}
                      <span className="optional">(optional)</span>
                    </label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-phone" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        placeholder="+216XXXXXXXX"
                        onChange={handlePhoneNumberChange}
                      />
                    </InputGroup>
                    <div className="phone_number error"></div>
                  </FormGroup>
                  {/* <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Role</label>
                        <Input
                        type="text"
                        id="role"
                        name="role"
                        value="Agence"
                        
                      />
                      </FormGroup>
                    </Col>
                  </Row> */}
                  <Button className="btn-fill" color="primary" type="submit">
                    Add
                  </Button>

                  <Button href="/admin/listofagency">Back</Button>
                </Form>
                {showNotification && (
                  <div className="alert alert-success mt-3" role="alert">
                    {showVerifyEmail
                      ? "Account Added."
                      : "This email is already a member in the website."}
                  </div>
                )}
                {showError && (
                  <div className="col-12 my-3 alert alert-danger">
                    Invalid fields !
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>


      </div>
    </>
  );
}
export default AddNew;
