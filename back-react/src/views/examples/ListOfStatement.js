import {
    Badge,
    Card,
    CardHeader,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Button,
  } from "reactstrap";
  // core components
  import Header from "components/Headers/Header.js";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { Link } from "react-router-dom";
  import { FaCircle } from "react-icons/fa";
  
  function ListofStatement() {
    const [statements, setStatements] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedExpert, setSelectedExpert] = useState("");
    const [experts, setExperts] = useState([])
    const [notification, setNotification] = useState("");
    const [errors, setErrors] = useState({});
    const [showError, setShowError] = useState(false);
  
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/getstatements");
        const filteredData = response.data.statements.filter(
          (statements) => statements.role !== "agency"
        );
        const expertsResponse = await axios.get("http://127.0.0.1:5000/all-experts");
  
        setExperts(expertsResponse.data.experts);
        console.log(filteredData);
        setStatements(filteredData);
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    useEffect(() => {
      console.log(statements);
    }, [statements]);
  
    const showNotification = (message) => {
      setNotification(message);
      setTimeout(() => setNotification(""), 10000);
    };
    const pageSize = 5;
    const pageCount = Math.ceil(statements.length / pageSize);
    const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  
    const handlePageClick = (page) => {
      setCurrentPage(page);
    };
    
    const handleAssignExpert = async (e, statement , selectedExpert) => {
      e.preventDefault();
      
      try {
        
        // const expertsResponse = await axios.get("http://127.0.0.1:5000/all-experts");
        
        // const expertObj = expertsResponse.data.experts.find((elem) => elem.email === selectedExpert);
  
        // console.log(expertObj);
        // if (!expertObj) {
        //   throw new Error("Expert not found");
        // }
    
        const assignResponse = await axios.post(
          `http://127.0.0.1:5000/assign_statements/${statement._id}/assign`,
          { email: selectedExpert }
        );
    
        console.log(assignResponse);
    
        if (assignResponse.status === 200) {
          statement.assign = !statement.assign;
          fetchData();
        } else {
          throw new Error(assignResponse.data.message);
        }
      } catch (error) {
        console.log(error.message);
        // show error message to the user
      }
      showNotification(`Statement ${statement._id} has been assigned to ${selectedExpert}`);
  
    };
  
    const paginatedStatements = statements.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  
  
  
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">List Of Statements</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr></tr>
                  </thead>
                  <tbody>
                    <th scope="col">Date</th>
                    <th scope="col">ContractNumber</th>
                    <th scope="col">Etat</th>
                  </tbody>
                  {paginatedStatements.map((statement) => {
                    console.log(statement); // Add this line to log the statements object
                    let color = "orange";
                    switch (statement.case_state) {
                      case "treated":
                        color = "green";
                        break;
                      case "closed":
                        color = "red";
                        break;
                      default:
                        break;
                    }
                    return (
                      <tr key={statement._id}>
                        <td>{statement.date}</td>
                        <td>{statement.vehicule_a.contractNumber}</td>
                        <td>
                          <FaCircle style={{ color: color }} />
                        </td>
                        <td>
                        <div className="d-flex">
                          <select
                            className="form-control"
                            onChange={(e) => setSelectedExpert(e.target.value)}
                            value={selectedExpert}
                          >
                            <option value="">Select expert</option>
                            {experts.map((expert) => (
                              <option value={expert.email} key={expert._id}>
                                {expert.email}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-primary ml-2"
                            onClick={(e) => handleAssignExpert(e, statement , selectedExpert)}
                            
                          >
        
                            Assign
                          </button>
                        </div>
                      </td>
                      </tr>
  
                    );
                  })}
  
                </Table>
                {notification && (
    <div className="alert alert-success">{notification}</div>
  )}
  
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink
                          onClick={() => handlePageClick(currentPage - 1)}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      {pages.map((page) => (
                        <PaginationItem key={page} active={currentPage === page}>
                          <PaginationLink onClick={() => handlePageClick(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem disabled={currentPage === pageCount}>
                        <PaginationLink
                          onClick={() => handlePageClick(currentPage + 1)}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
  
  export default ListofStatement;
  