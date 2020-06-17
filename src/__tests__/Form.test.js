import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import api from '../services/api';

const apiMock = new MockAdapter(api);

import Form from '../pages/Form';

describe("Form component", () => {
  it("should be able to add new register", async () => {
    const { getByText } = render(<Form />);

    apiMock.onGet("usuarios").reply(200, []);

    apiMock.onPost("usuarios").reply(200, {
      name: "João Vitor",
      cpf: "12345678900",
      email: "joao@joao.com",
      endereco: {
        cep: "14050500",
        address: "Rua Teste",
        addressNumber: "10",
        neighborhood: "Bairro Teste",
        city: "Ribeirão Preto"
      },
      id: "99"
    })

    fireEvent.click(getByText("Cadastrar"));
  });
});