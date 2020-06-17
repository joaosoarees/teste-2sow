import { makeStyles } from '@material-ui/core';

/**
 * Estilização da página
 */

export const useStyles = makeStyles((theme) => ({
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

export const useStylesBar = makeStyles(() => ({
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