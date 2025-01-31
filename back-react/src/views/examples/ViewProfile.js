/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { Redirect, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}




const ViewProfile = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [tfa, setTfa] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [fastate, setFastate] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [role, setRole] = useState("");





  const handleOnline = async () => {

    const jwt = getCookie("jwt");
    if(jwt == "") return ;
  
    const email = (
      await axios.get("http://localhost:5000/getmailfromtoken?token=" + jwt)
    ).data.email;
  
    try {
      await axios.post("http://localhost:5000/status/" + email, {
        expert_status: true,
      });
      setIsAvailable(true);
      toast.success('You are now online!');
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const handleOffline = async () => {
    const jwt = getCookie("jwt");
    if(jwt == "") return ;
  
    const email = (
      await axios.get("http://localhost:5000/getmailfromtoken?token=" + jwt)
    ).data.email;
  
    try {
      await axios.post("http://localhost:5000/statusoffline/" + email, {
        expert_status: false,
      });
      setIsAvailable(false);
      toast.warning('You are now offline.');
      console.log("Offline status updated successfully");
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    //if (getCookie("role") !== "Client") window.location.href = "/auth/login";
    setRole( getCookie("role"));
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const jwt = getCookie("jwt");
    if(jwt == "") return ;

    async function getUser(jwt) {
      const response = (
        await axios.get("http://127.0.0.1:5000/getmailfromtoken?token=" + jwt)
      ).data;

      setFirstName(response.first_name);
      setLastName(response.last_name);
      setEmail(response.email);
      setGender(response.gender);
      setTfa(response.two_factor_auth);
      setPhone(response.phone_number);
      setAddress(response.address);
      setImage(response.image);

      const date = new Date(response.date_of_birth);
      const formattedDate = date.toLocaleDateString("en-US");
      setDate(new Date(formattedDate));

      console.log(
        firstName,
        lastName,
        email,
        gender,
        tfa,
        phone,
        address,
        date
      );
    }
    getUser(jwt);
  }, []);

  return (
    <>
      {window.location.pathname != "/profile" && <UserHeader />}
      {/* Page content */}
      <Container className="mt--7" fluid>
      <ToastContainer />
        <Row>
          <p></p>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <Col xl="4"></Col>
          <Col className="order-xl-2 mb-5 mb-xl-0" l="4" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        // src={require("../../assets/img/theme/team-4-800x800.jpg")}
                        src={"" + image}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    size="sm"
                    href={
                      //TODO : change location
                      window.location.pathname != "/profile" 
                        ? "/main/changepassword/"
                        : "changepassword"
                    }
                  >
                    Change <br /> Password
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href={
                      window.location.pathname != "/profile"
                        ? "/main/user-profile/"
                        : "modifyprofile"
                    }
                    size="sm"
                  >
                    Update
                    <br /> profile
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5"></div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    {firstName + " , " + lastName}
                    <span className="font-weight-light">, {address}</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {email}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {phone}
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    {address}
                  </div>

                  <hr className="my-4" />
                  {role==="Expert" && (    <div style={{ display: "flex", justifyContent: "space-between" }}>
               
               <Button
                 color="danger"
                 onClick={(e) => handleOffline()}
                 disabled={!isAvailable} 
               >
                 Go Offline
               </Button>
               <Button
                 color="primary"
                 className="mr-4"
                 onClick={(e) => handleOnline()}
                 disabled={isAvailable} 
               >
                 Go Online
               </Button>
               </div>)}
              

              

                  <hr className="my-4" />
                  {(tfa==="sms" || tfa==="SMS" ) ? (""):
                  (  <div>
                    <i className="ni education_hat mr-2" />
                    <span>Your profile is not secured activate please  the double authentification</span>
                  </div>) 
                 }
                 
                  
                

               

                  {/* <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    BOUTON NBADLOUH
                  </a> */}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ViewProfile;
