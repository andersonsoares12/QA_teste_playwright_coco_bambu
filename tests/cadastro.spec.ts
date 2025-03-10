import { test, expect } from '@playwright/test';

test('Cadastro de usuário E-mail já cadastrado', async ({ page }) => {
  await page.goto('https://app-hom.cocobambu.com/on-boarding/delivery?nextPage=%2Fdelivery');

  // Dados dinâmicos para preenchimento
  const userData = {
    name: 'Anderson dos Santos Soares',
    email: 'andersonsoares.jk@gmail.com',
    password: '@As12no23'
  };

  // Acessando a página de cadastro
  await page.locator('div').filter({ hasText: /^Perfil$/ }).click();
  await page.locator('div').filter({ hasText: 'Entrar' }).click();
  await page.waitForTimeout(1000);
  await page.getByText('Cadastre-se').click();

  // Função para preencher campos dinamicamente
  const preencherCampo = async (selector, value) => {
    const campo = page.locator(selector);
    await campo.click();
    await campo.fill(value);
  };

  await preencherCampo('input[name="name"]', userData.name);
  await preencherCampo('#ion-input-5', userData.email);
  await preencherCampo('#ion-input-6', userData.password);

  // Verifica se o e-mail já foi cadastrado
  await expect(page.locator('#formRegisterUser')).toContainText('E-mail já cadastrado.');
});