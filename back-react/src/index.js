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
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import 'draft-js/dist/Draft.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import AdminLayout from "layouts/Admin.js";
import MainLayout from "layouts/Main.js";
import AuthLayout from "layouts/Auth.js";
import AgenceLayout from "layouts/Agence.js";
import ExpertLayout from "layouts/Expert.js";
import LandingLayout from "layouts/landing.js";
import 'react-image-crop/dist/ReactCrop.css';

import ViewsLayout from "layouts/views";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      <Route path="/agence" render={(props) => <AgenceLayout {...props} />} />
      <Route path="/main" render={(props) => <MainLayout {...props} />} />
      <Route path="/expert" render={(props) => <ExpertLayout {...props} />} />
      <Route path="/" render={(props) => <LandingLayout {...props} />} />
      //TODO : 404
      <Redirect from="/argon-dashboard-react" to="/" />
    </Switch>
  </BrowserRouter>
);
