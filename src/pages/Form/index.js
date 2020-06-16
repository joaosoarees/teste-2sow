import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Avatar, Button, CssBaseline, TextField, Grid,
  Typography, makeStyles, Container,
  AppBar, Toolbar
} from '@material-ui/core';
import { PersonAdd } from '@material-ui/icons';

import axios from 'axios';
import api from '../../services/api';
import swal from 'sweetalert';
import { cpfMask } from '../../utils/cpfMask';
import { cepMask } from '../../utils/cepMask';
import Footer from '../../components/Footer';

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: '100vh',
    flexDirection: 'column',
    display: 'flex',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  footer: {
    marginTop: 'auto',
    padding: theme.spacing(6),
  },
}));

const useStylesBar = makeStyles(() => ({
  bar: {
    marginBottom: '60px',
  },
  button: {
    marginLeft: '50px',
    color: '#fff',
    fontWeight: 900,
  },
  title: {
    flexGrow: 1,
    color: '#fff',
  },
  text: {
    color: '#fff',
    fontWeight: 500,
  },
}));

export default function Form() {
  const classes = useStyles();
  const topClasses = useStylesBar();
  const history = useHistory();
  const token = localStorage.getItem('token');

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [cep, setCep] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');

  function getFocus(id) {
    return (document.getElementById(id).focus());
  };

  async function getViaCep() {
    const viaCep = await axios.get(`http://viacep.com.br/ws/${cep}/json/unicode/`);

    if (viaCep.data.cep) {
      setNeighborhood(viaCep.data.bairro);
      setCity(viaCep.data.localidade);
      setAddress(viaCep.data.logradouro);

      getFocus('addressNumber');

    } else if (!viaCep.data.cep) {
        setCep('');
        setAddress('');
        setAddressNumber('');
        setNeighborhood('');
        setCity('')

        swal("CEP não encontrado!", "Verifique seu CEP e tente novamente.");
        getFocus('cep');
    } else if (cep === '') {
        setNeighborhood('');
        setCity('');
        setAddress('');
    };
  };

  if (cep.length === 9 || cep.length === 8) {
    getViaCep();
  };

  async function handleRegister(e) {
    e.preventDefault();

    const formatedCpf = cpfMask(cpf);
    const formatedCep = cepMask(cep);

    const data = ({
      name,
      cpf: formatedCpf,
      email,
      endereco: {
        cep: formatedCep,
        address,
        addressNumber,
        neighborhood,
        city
      }
    });

    try {
      await api.post('/usuarios', data);
      swal("Usuário cadastrado com sucesso!", "", "success");
    } catch (err) {
        swal("Erro ao cadastrar usuário!", "Tente novamente", "error");
      };

    setCep('');
    setName('');
    setCpf('');
    setEmail('');
    setAddress('');
    setAddressNumber('');
    setNeighborhood('');
    setCity('');
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push('/');
  };

  const handleUsers = () => {
    history.push('/usuarios');
  };

  return ( token && 
    <>
      <div className={classes.page}>
        <AppBar position="static" className={topClasses.bar}>
          <Toolbar>
            <Typography variant="h6" className={topClasses.title}>
              Cadastrar Usuário
            </Typography>
              <Typography className={topClasses.text}>
                <Button variant="text" onClick={handleUsers} className={topClasses.button}>
                Usuários Cadastrados
                </Button>
                <Button variant="text" onClick={handleLogout} className={topClasses.button}>
                  Logout
                </Button>
              </Typography>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonAdd />
            </Avatar>
            <Typography component="h1" variant="h5">
              Cadastre um novo usuário
            </Typography>
            <form onSubmit={handleRegister} className={classes.form} >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="string"
                    name="name"
                    label="Nome"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    inputProps={{maxLength: 11}}
                    placeholder="exemplo: 12345678900"
                    variant="outlined"
                    required
                    fullWidth
                    type="string"
                    id="cpf"
                    label="CPF"
                    name="cpf"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    autoComplete="CPF"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    type="email"
                    label="Email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="Email"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    inputProps={{maxLength: 9}}
                    placeholder="exemplo: 12345000 ou 12345-000"
                    autoComplete="CEP"
                    name="cep"
                    variant="outlined"
                    required
                    fullWidth
                    type="string"
                    id="cep"
                    value={cep}
                    onChange={e => setCep(e.target.value)}
                    label="CEP"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField 
                    variant="outlined"
                    required
                    fullWidth
                    type="string"
                    name="address"
                    label="Endereço"
                    id="address"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="Número"
                    name="addressNumber"
                    variant="outlined"
                    required
                    fullWidth
                    type="string"
                    id="addressNumber"
                    value={addressNumber}
                    onChange={e => setAddressNumber(e.target.value)}
                    label="Número"
                    autoFocus={false}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="Bairro"
                    name="neighborhood"
                    variant="outlined"
                    required
                    fullWidth
                    type="string"
                    id="neighborhood"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    label="Bairro"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="Cidade"
                    name="city"
                    variant="outlined"
                    required
                    type="string"
                    fullWidth
                    id="city"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    label="Cidade"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Cadastrar
              </Button>
            </form>            
          </div>
        </Container>
        <Footer />
      </div>
    </>
  );
}