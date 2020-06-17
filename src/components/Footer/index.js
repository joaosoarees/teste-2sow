import React from 'react';

/**
 * Rodapé da página + estilização
 */

import { Typography, makeStyles, Container } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: '#eee',
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Typography variant="h6" align="center" gutterBottom>
          Desenvolvido por João Vitor
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Teste front-end/mobile na 2SOW.
        </Typography>
      </Container>
    </footer>
);
}

