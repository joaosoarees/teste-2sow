import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Form from './pages/Form';
import Users from './pages/Users';

function PrivateRoute({ component: Component, ...rest }) {
  let { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Route { ...rest } render={(props) => (
      isAuthenticated ? (<Component { ...props }/>) : (<Redirect to={{ pathname: '/', state: { from: props.location } }}/>)
    )} />
  );
};

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <PrivateRoute path="/form" exact component={Form} />
        <PrivateRoute path="/usuarios" exact component={Users} />
      </Switch>
    </BrowserRouter>
  );
}