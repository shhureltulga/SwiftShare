import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBCard, MDBCardBody, MDBInput, MDBIcon, MDBCheckbox } from 'mdb-react-ui-kit';
import { useFormik } from 'formik';
import { Navigate } from 'react-router';
import "../Css/Login.css";

function App() {
  const [redirect, setRedirect] = useState({
    sendRedirect: false,
    recieveRedirect: false,
  });

  const handleOnClickSend = () => {
    setRedirect((prev) => ({ ...prev, sendRedirect: true }));
  }

  const handleOnClickRecieve = () => {
    setRedirect((prev) => ({ ...prev, recieveRedirect: true }));
  }

  useEffect(() => {
    const username = sessionStorage.getItem('sid');
    if (username) {
      sessionStorage.removeItem('sid');
    }
  }, []);

  const loginto = async (username, password) => {
    const response = await fetch('http://172.16.10.11/erpgw_api/post/gw_to_erp/get_erp_login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'PHPSESSID=5s432qr5pgiqg1m1p26tclibr1',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        isERP: 0,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem('sid', data.result.sessionid);
      sessionStorage.setItem('empid', data.result.employeeid);
      sessionStorage.setItem('personname', data.result.personname);
      handleOnClickSend();
    } else {
      console.error('Error:', response.statusText);
    }
  };

  const formik = useFormik({
    initialValues: {
      loginUsername: '',
      loginPassword: '',
    },
    onSubmit: async (values) => {
      await loginto(values.loginUsername, values.loginPassword);
    },
  });

  if (redirect.sendRedirect) {
    return <Navigate to="/" />
  } else if (redirect.recieveRedirect) {
    return <Navigate to="/download" />
  }

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol col="12">
          <MDBCard className="bg-white my-5 mx-auto" style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className="p-5 w-100 d-flex flex-column">
              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">Please enter your login and password!</p>

              <form onSubmit={formik.handleSubmit}>
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  label="Email address"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  value={formik.values.loginUsername}
                  onChange={formik.handleChange}
                  name="loginUsername"
                />
                <MDBInput
                  wrapperClass="mb-4 w-100"
                  label="Password"
                  id="formControlLg"
                  type="password"
                  size="lg"
                  value={formik.values.loginPassword}
                  onChange={formik.handleChange}
                  name="loginPassword"
                />

                {/* <MDBCheckbox
                  name="flexCheck"
                  id="flexCheckDefault"
                  className="mb-4"
                  label="Remember password"
                /> */}

                <MDBBtn className="mb-4 w-100" size="lg" type="submit">
                  Login
                </MDBBtn>

                <hr className="my-4" />

                {/* <MDBBtn className="mb-2 w-100" size="lg" style={{ backgroundColor: '#dd4b39' }}>
                  <MDBIcon fab icon="google" className="mx-2" />
                  Sign in with Google
                </MDBBtn>

                <MDBBtn className="mb-4 w-100" size="lg" style={{ backgroundColor: '#3b5998' }}>
                  <MDBIcon fab icon="facebook-f" className="mx-2" />
                  Sign in with Facebook
                </MDBBtn> */}
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
