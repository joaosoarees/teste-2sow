import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { 
  AppBar, Button, Card, CardActions, CardContent, CssBaseline,
  Grid, Toolbar, Typography, Container, TextField
 } from '@material-ui/core';

import { useStyles, useStylesBar } from './styles';
import api from '../../services/api';
import swal from '@sweetalert/with-react'
import { cpfMask } from '../../utils/cpfMask';
import { cepMask } from '../../utils/cepMask';
import Footer from '../../components/Footer';

export default function Users() {
  const classes = useStyles();
  const topClasses = useStylesBar();
  const history = useHistory();

  // Hook para armazenar e alterar estado
  const [registers, setRegisters] = useState([]);
  const [, setName] = useState('');
  const [, setCpf] = useState('');
  const [, setEmail] = useState('');
  const [, setAddress] = useState('');
  const [, setAddressNumber] = useState('');
  const [, setCep] = useState('');
  const [, setNeighborhood] = useState('');
  const [, setCity] = useState('');
  const [search, setSearch] = useState();
  const [inputSearch, setInputSearch] = useState('');

  // Função para deslogar
  const handleLogout = () => {
    history.push('/');
  };
  
  // Envia o usuário para a tela de Cadastro
  const handleRegister = () => {
    history.push('/form');
  };

  // Pega o valor do input
  function getInputValue(id) {
    return (document.getElementById(id).value);
  };

  // Hook para buscar um registro pelo valor digitado no campo de busca
  useEffect(() => {
    let searchedName = getInputValue('search');
    api.get(`usuarios?q=${searchedName}`).then(response => { setSearch(response.data) });
  }, [inputSearch]);

  // Hook para pegar os registros do nosso db.json em ordem alfabética
  useEffect(() => {
    api.get('usuarios?_sort=name&_order=asc').then(response => { setRegisters(response.data) });
  }, [registers]);

  // Função para buscar o nome digitado do campo de busca e retornar os registros encontrados
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
  
  // Função para editar um registro
  async function handleEditRegister(id) {
    const oldData = await api.get(`usuarios/${id}`);
    
    async function Submit(e) {
      e.preventDefault();
      
      const data = {
        name: getInputValue('name') || oldData.data.name,
        cpf: cpfMask(getInputValue('cpf')) || oldData.data.cpf,
        email: getInputValue('email') || oldData.data.email,
        endereco: {
          cep: cepMask(getInputValue('cep')) || oldData.data.endereco.cep,
          address: getInputValue('address') || oldData.data.endereco.address,
          addressNumber: getInputValue('addressNumber') || oldData.data.endereco.addressNumber,
          neighborhood: getInputValue('neighborhood') || oldData.data.endereco.neighborhood,
          city: getInputValue('city') || oldData.data.endereco.city
        }
      };

      try {
        api.put(`usuarios/${id}`, data)
        swal("Usuário editado com sucesso!", "", "success");
      } catch (err) {
        swal("Erro!", "", "error")
      }; 
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
                  defaultValue={oldData.data.name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  inputProps={{maxLength: 15}}
                  placeholder="exemplo: 12345678900"
                  variant="outlined"
                  fullWidth
                  type="string"
                  id="cpf"
                  label="CPF"
                  name="cpf"
                  defaultValue={oldData.data.cpf}
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
                  defaultValue={oldData.data.email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  inputProps={{maxLength: 9}}
                  variant="outlined"
                  fullWidth
                  id="cep"
                  type="string"
                  label="CEP"
                  name="cep"
                  defaultValue={oldData.data.endereco.cep}
                  onChange={e => setCep(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="address"
                  type="string"
                  label="Endereço"
                  name="address"
                  defaultValue={oldData.data.endereco.address}
                  onChange={e => setAddress(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="addressNumber"
                  type="string"
                  label="Número"
                  name="addressNumber"
                  defaultValue={oldData.data.endereco.addressNumber}
                  onChange={e => setAddressNumber(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="neighborhood"
                  type="string"
                  label="Bairro"
                  name="neighborhood"
                  defaultValue={oldData.data.endereco.neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
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
                  defaultValue={oldData.data.endereco.city}
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

  // Função para deletar um registro
  async function handleDeleteRegister(id) {
    try {
      await api.delete(`usuarios/${id}`);
      setRegisters(registers.filter(register => register.id !== id));
      swal("Usuário deletado com sucesso!", "", "success");
    } catch (err) {
      swal("Erro ao deletar usuário!", "Tente novamente.", "error");
    };
  };

  return (
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
