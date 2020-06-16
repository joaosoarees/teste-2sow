import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { 
  AppBar, Button, Card, CardActions, CardContent, CssBaseline,
  Grid, Toolbar, Typography, makeStyles, Container, TextField
 } from '@material-ui/core';

import api from '../../services/api';
import swal from '@sweetalert/with-react'
import { cpfMask } from '../../utils/cpfMask';
import Footer from '../../components/Footer';

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: '100vh',
    flexDirection: 'column',
    display: 'flex',
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    marginTop: 'auto',
    padding: theme.spacing(6),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  search: {
    marginBottom: '50px',
  }
}));

const useStylesBar = makeStyles(() => ({
  bar: {
    marginBottom: '30px',
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

export default function Users() {
  const classes = useStyles();
  const topClasses = useStylesBar();
  const token = localStorage.getItem('token');
  const history = useHistory();

  const [registers, setRegisters] = useState([]);
  const [name, setName] = useState();
  const [cpf, setCpf] = useState();
  const [email, setEmail] = useState();
  const [city, setCity] = useState();
  const [search, setSearch] = useState();
  const [inputSearch, setInputSearch] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    history.push('/');
  };

  const handleRegister = () => {
    history.push('/form');
  };

  function getInputValue(id) {
    return (document.getElementById(id).value);
  };

  useEffect(() => {
    let searchedName = getInputValue('search');
    api.get(`usuarios?q=${searchedName}`).then(response => { setSearch(response.data) });
  }, [inputSearch]);

  useEffect(() => {
    api.get('usuarios?_sort=name&_order=asc').then(response => { setRegisters(response.data) });
  }, [registers]);

  function searchByName(e) {
    e.preventDefault();
    setInputSearch('');
    
    return (
      swal(
        <>
          <Grid container spacing={4}>
            {search.map(searched => (
              <Grid item key={searched.id} xs={12} sm={12} md={12}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {searched.name}
                  </Typography>
                  <Typography>
                    <strong>CPF: </strong>{searched.cpf}
                  </Typography>
                  <Typography>
                    <strong>Email: </strong>{searched.email}
                  </Typography>
                  <Typography>
                    <strong>Cidade: </strong>{searched.endereco.city}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => handleEditRegister(searched.id)} size="small" color="primary">
                    Editar
                  </Button>
                  <Button onClick={() => handleDeleteRegister(searched.id)} size="small" color="secondary">
                    Deletar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            ))}  
          </Grid>
        </>    
      )
    );
  };
    
  async function handleEditRegister(id) {
    setName();
    setCpf();
    setEmail();
    setCity();

    async function Submit(e) {
      e.preventDefault();
      
      const oldData = await api.get(`usuarios/${id}`);

      const data = {
        name: getInputValue('name') || oldData.data.name,
        cpf: cpfMask(getInputValue('cpf')) || oldData.data.cpf,
        email: getInputValue('email') || oldData.data.email,
        endereco: {
          cep: oldData.data.endereco.cep,
          address: oldData.data.endereco.address,
          addressNumber: oldData.data.endereco.addressNumber,
          neighborhood: oldData.data.endereco.neighborhood,
          city: getInputValue('city') || oldData.data.endereco.city
        }
      };

      try {
        api.put(`usuarios/${id}`, data)
        swal("Usuário editado com sucesso!", "", "success");
      } catch (err) {
        swal("Erro!", "", "error")
      };

      setName();
      setCpf();
      setEmail();
      setCity();
    };

    return (
      swal(
        <> 
          <form onSubmit={Submit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="string"
                  name="name"
                  label="Nome"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  inputProps={{maxLength: 11}}
                  placeholder="exemplo: 12345678900"
                  variant="outlined"
                  fullWidth
                  type="string"
                  id="cpf"
                  label="CPF"
                  name="cpf"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  type="string"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  autoComplete="Cidade"
                  name="city"
                  variant="outlined"
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
              Atualizar
            </Button>
          </form>
        </>
      )
    );
  };

  async function handleDeleteRegister(id) {
    try {
      await api.delete(`usuarios/${id}`);
      setRegisters(registers.filter(register => register.id !== id));
      swal("Usuário deletado com sucesso!", "", "success");
    } catch (err) {
      swal("Erro ao deletar usuário!", "Tente novamente.", "error");
    };
  };

  return (token &&
    <>
      <div className={classes.page}>
        <CssBaseline />
        <AppBar position="static" className={topClasses.bar}>
          <Toolbar>
            <Typography variant="h6" className={topClasses.title}>
              Usuários Cadastrados
            </Typography>
              <Typography className={topClasses.text}>
                <Button variant="text" onClick={handleRegister} className={topClasses.button}>
                  Cadastrar Usuário
                </Button>
                <Button variant="text" onClick={handleLogout} className={topClasses.button}>
                  Logout
                </Button>
              </Typography>
          </Toolbar>
        </AppBar>

        <main>
          <Container className={classes.cardGrid} maxWidth="md">
            <form onSubmit={searchByName}>
              <Grid className={classes.search} item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  type="text"
                  name="search"
                  label="Campo de busca"
                  id="search"
                  value={inputSearch}
                  onChange={e => setInputSearch(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Pesquisar
                </Button>
              </Grid>
            </form>
            
            <Grid container spacing={4}>
              {registers.map(register => (
                <Grid item key={register.id} xs={12} sm={6} md={6}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {register.name}
                      </Typography>
                      <Typography>
                        <strong>CPF: </strong>{register.cpf}
                      </Typography>
                      <Typography>
                        <strong>Email: </strong>{register.email}
                      </Typography>
                      <Typography>
                        <strong>Cidade: </strong>{register.endereco.city}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => handleEditRegister(register.id)} size="small" color="primary">
                        Editar
                      </Button>
                      <Button onClick={() => handleDeleteRegister(register.id)} size="small" color="secondary">
                        Deletar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        <Footer />
      </div> 
    </>
  );
}
