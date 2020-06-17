import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { 
  Avatar, Button, CssBaseline, TextField,
  Typography, Container, AppBar, Toolbar
 } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { useStyles } from './styles';
import { login } from '../../store/auth';
import swal from 'sweetalert';
import Footer from '../../components/Footer';

export default function Login() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  // Armazena o valor do input digitado
  function getInputValue(id) {
    return (document.getElementById(id).value);
  };

  // Função para autenticar usuário e envia-lo a tela de usuários cadastrados
  function handleLogin(e) {
    e.preventDefault();

    const password = getInputValue('password');

    if(password.length > 4) {
      dispatch(login());
      swal("Login efetuado com sucesso!", "", "success");
      history.push('/usuarios');
    } else {
      swal("Error", "Senha deve ser maior que 4 caracteres", "error");
    }
  };

  return (
    <>
      <div className={classes.page}>
        <AppBar position="relative">
            <Toolbar>
              <Typography variant="h6" color="inherit" noWrap>
                Login
              </Typography>
            </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Entre com seu usuário
            </Typography>
            <form onSubmit={handleLogin} className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                placeholder="exemplo: teste@teste.com"
                id="email"
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                placeholder="Maior que 4 caracteres"
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Entrar
              </Button>
            </form>
          </div>
        </Container>
        <Footer />
      </div>  
    </>
  );
}