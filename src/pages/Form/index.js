import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Avatar, Button, CssBaseline, TextField, Grid,
  Typography, Container, AppBar, Toolbar
} from '@material-ui/core';
import { PersonAdd } from '@material-ui/icons';

import { useStyles, useStylesBar } from './styles';
import axios from 'axios';
import api from '../../services/api';
import swal from 'sweetalert';
import { cpfMask } from '../../utils/cpfMask';
import { cepMask } from '../../utils/cepMask';
import Footer from '../../components/Footer';

export default function Form() {
  const classes = useStyles();
  const topClasses = useStylesBar();
  const history = useHistory();

  // Hook para armazenar e alterar estado
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [cep, setCep] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');

  // Foca em um input com id declarado
  function getFocus(id) {
    return (document.getElementById(id).focus());
  };

  // Função para chamar o webservice ViaCEP e inserir os dados do cep informado nos campos de endereço
  async function getViaCep() {
    const viaCep = await axios.get(`http://viacep.com.br/ws/${cep}/json/unicode/`);

    if (viaCep.data.cep) {
      setNeighborhood(viaCep.data.bairro);
      setCity(viaCep.data.localidade);
      setAddress(viaCep.data.logradouro);
    } else if (!viaCep.data.cep) {
        setCep('');
        setAddress('');
        setAddressNumber('');
        setNeighborhood('');
        setCity('')

        swal("CEP não encontrado!", "Verifique seu CEP e tente novamente.");
    } else if (cep === '') {
        setNeighborhood('');
        setCity('');
        setAddress('');
    };
  };

  // Condição para que a função getViaCep seja executada
  if (cep.length === 9 || cep.length === 8) {
    getViaCep();
    getFocus('addressNumber');
  } 

  // Função para cadastrar um novo usuário no db.json
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

  // Função para deslogar 
  const handleLogout = () => {
    history.push('/');
  };
  // Envia o usuário para a tela de usuários cadastrados
  const handleUsers = () => {
    history.push('/usuarios');
  };

  return (
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