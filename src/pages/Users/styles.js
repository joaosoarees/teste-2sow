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
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
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

export const useStylesBar = makeStyles(() => ({
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