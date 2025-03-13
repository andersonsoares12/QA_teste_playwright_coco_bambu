import { test, expect } from '@playwright/test';

const API_URL = 'https://dummyjson.com/carts';

test.describe.only('API Cart Tests', () => {
  let context;

  // Criar um contexto de requisição antes de todos os testes
  test.beforeAll(async ({ playwright }) => {
    context = await playwright.request.newContext();
  });

  // Encerrar o contexto após todos os testes
  test.afterAll(async () => {
    await context.dispose();
  });

// Teste para adicionar itens ao carrinho
test('Adicionar item ao carrinho e validar todos os produtos', async () => {
  const response = await context.post(`${API_URL}/add`, {
    data: {
      userId: 1,
      products: [
        { id: 144, quantity: 2 },
        { id: 145, quantity: 4 },
        { id: 146, quantity: 3 },
        { id: 147, quantity: 5 },
        { id: 148, quantity: 6 },
      ],
    },
  });

  // Log do status da resposta
  console.log(`Status recebido: ${response.status()}`);
  
  const body = await response.json();

  // Log do corpo completo da resposta
  console.log('Resposta da API:', body);

  // Defina a lista de produtos esperados
  const expectedProducts = [
    { id: 144, quantity: 2 },
    { id: 145, quantity: 4 },
    { id: 146, quantity: 3 },
    { id: 147, quantity: 5 },
    { id: 148, quantity: 6 },
  ];

  // Valide que a quantidade de produtos no array é a esperada
  expect(body.products).toHaveLength(expectedProducts.length);

  // Percorra e valide todos os objetos na resposta
  expectedProducts.forEach((expectedProduct) => {
    const product = body.products.find(p => p.id === expectedProduct.id);

    // Log do produto encontrado
    console.log('Produto encontrado:', product);

    expect(product).toEqual(
      expect.objectContaining({
        id: expectedProduct.id,
        quantity: expectedProduct.quantity,
      })
    );
  });
});

  
// Cenário Negativo: Campos obrigatórios ausentes
test('Adicionar item ao carrinho sem userId', async () => {
  const response = await context.post(`${API_URL}/add`, {
    data: {
      products: [{ id: 144, quantity: 4 }],
    },
  });

  // Adiciona logs para inspecionar o status e o corpo da resposta
  console.log(`Status recebido: ${response.status()}`);
  const body = await response.json();
  console.log('Resposta da API:', body);

  // Validações
  expect(response.status()).toBe(400); // Status esperado para campos ausentes
  expect(body).toHaveProperty('message'); // Valida que há uma mensagem de erro
});


// Cenário Negativo: Quantidade negativa de produtos
test('Adicionar item ao carrinho com quantidade negativa', async () => {
  const response = await context.post(`${API_URL}/add`, {
    data: {
      userId: 1,
      products: [{ id: 144, quantity: -1 }],
    },
  });

  // Log para depuração
  console.log(`Status recebido: ${response.status()}`);
  const body = await response.json();
  console.log('Resposta da API:', body);

  // Valida que a API retornou um status de sucesso (201)
  expect(response.status()).toBe(201); // Ajuste para o status retornado pela API

  // Valida que o produto com quantidade negativa foi adicionado
  const product = body.products.find((p) => p.id === 144);
  expect(product).toEqual(
    expect.objectContaining({
      id: 144,
      quantity: -1,
    })
  );

  // Adiciona log para verificar valores negativos
  console.log('Produto com quantidade negativa:', product);
});



// Verificação de Limites
test('Adicionar item ao carrinho com quantidade máxima', async () => {
  const response = await context.post(`${API_URL}/add`, {
    data: {
      userId: 1,
      products: [{ id: 144, quantity: 10000 }],
    },
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  
  // Adiciona log do corpo da resposta
  console.log('Resposta completa:', body);

  // Adiciona log específico para o primeiro produto
  console.log('Produto específico:', body.products[0]);

  // Valida que a quantidade do primeiro produto é menor ou igual a 10000
  expect(body.products[0].quantity).toBeLessThanOrEqual(10000);
});


// Validação de Headers
test('Verificar headers da resposta', async () => {
  const response = await context.post(`${API_URL}/add`, {
    data: {
      userId: 1,
      products: [{ id: 144, quantity: 4 }],
    },
  });

  // Exibe os headers no console
  console.log('Headers da resposta:', response.headers());

  // Verifica o header content-type
  expect(response.headers()['content-type']).toContain('application/json');
});


// Performance e Tempo de Resposta
test('Adicionar item ao carrinho - validação de tempo de resposta', async () => {
  const startTime = Date.now();
  const response = await context.post(`${API_URL}/add`, {
    data: {
      userId: 1,
      products: [{ id: 144, quantity: 4 }],
    },
  });
  const endTime = Date.now();

  // Calcula e exibe o tempo de resposta
  const responseTime = endTime - startTime;
  console.log(`Tempo de resposta: ${responseTime}ms`);

  expect(response.status()).toBe(201);
  expect(responseTime).toBeLessThan(1000); // 1 segundo
});


  // Validar estrutura da resposta
  test('Validar estrutura da resposta ao adicionar item', async () => {
    const response = await context.post(`${API_URL}/add`, {
      data: {
        userId: 1,
        products: [{ id: 193, quantity: 4 }],
      },
    });
    const body = await response.json();
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
        products: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            quantity: expect.any(Number),
          }),
        ]),
      })
    );
    console.log(body);
  });

  // Cenário Negativo: Adicionar produto inexistente
  test('Adicionar produto inexistente ao carrinho', async () => {
    const response = await context.post(`${API_URL}/add`, {
      data: {
        userId: 1,
        products: [{ id: 195, quantity: 99999 }], // ID de produto inexistente
      },
    });
  
    // Valida que a API ainda retorna um status de sucesso (201)
    expect(response.status()).toBe(201); // API aceita a requisição
  
    const body = await response.json();
  
    // Valida que o array de produtos está vazio, já que o produto não existe
    console.log(body.products, "Lista de Produtos Deve retornar esta vazia"); // Log para depuração
    expect(body.products).toEqual([]); // Espera-se que nenhum produto seja adicionado
  });
  
  
  // Atualizar carrinho
  test('Atualizar carrinho', async () => {
    const response = await context.put(`${API_URL}/19`, {
      data: {
        merge: true,
        products: [{ id: 1, quantity: 1 }],
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
  
    // Valida que o produto com id 1 está presente na resposta
    expect(body.products).toContainEqual(
      expect.objectContaining({
        id: 1,
        quantity: 1,
      })
    );
  
    // Localiza o produto com id 1 e o exibe no console
    const product = body.products.find((p) => p.id === 1);
    console.log(product); // Mostra somente o produto com id 1
  });
  

  // Remover produto de um carrinho
  test('Remover produto do carrinho', async () => {
    const response = await context.delete(`${API_URL}/14`, {
      data: { productId: 14 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body.products).not.toContainEqual(
      expect.objectContaining({
        id: 144,
      })
    );
    console.log(body.products);
  });

  // Cenário Negativo: Remover produto inexistente
  test('Remover produto inexistente do carrinho', async () => {
    const response = await context.delete(`${API_URL}/1`, {
      data: { productId: 9999 }, // Produto inexistente
    });
  
    expect(response.status()).toBe(200); // API retorna 200 mesmo para "remoção simulada"
    const body = await response.json();
  
    // Valida as propriedades retornadas na resposta
    expect(body).toEqual(
      expect.objectContaining({
        id: 1,
        isDeleted: true,
        deletedOn: expect.any(String), // Verifica que a data de exclusão é uma string
      })
    );
  
    // Opcional: Verificar que o carrinho ainda contém os produtos
    expect(body.products).toBeInstanceOf(Array);
    expect(body.products).toHaveLength(4); // Número total de produtos no carrinho
    console.log(body);
    });
  
});
