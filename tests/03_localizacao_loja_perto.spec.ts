import { test, expect } from '@playwright/test';
import { realizarLogin } from './utils/loginHelper'; // Importa a função de login
import { log } from 'console';

test.use({ browserName: 'firefox' }); 

test.describe('Localização loja perto', () => {
test('Case localização loja perto falha', async ({ page }) => {
  
  log('Teste validar pagamento via pix iniciado');
  //const email = 'andersonsoares.jk@gmail.com';
  const email = 'meucopocriativo@gmail.com';
  const password = '@As12no23';
  const otpValue = 'A';
  const otpFieldsCount = 6;
  const otpPrefix = 'otp'; // Prefixo do ID dos campos OTP

  // Navegar para a página inicial
  await page.goto('/');
  const currentUrl = page.url();

  // Realizar o login utilizando a função importada
  await realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue);

  //muda para o endereço cadastrado.
  //await page.waitForSelector('fake-select'); // Aguarda a página carregar
  await page.locator('fake-select').click();


  await page.getByText('Rua Aracajú 520 - Dom Lustosa').click();

  //await page.getByRole('button', { name: 'QUERO MUDAR O ENDEREÇO' }).click();

  // Espera o elemento aparecer no DOM
  await page.waitForSelector('error-message-screen'); // Aguarda a página carregar
  //verifica mensagem de erro
  await expect(page.locator('error-message-screen')).toContainText('Ops...');
  await expect(page.locator('error-message-screen')).toContainText('O endereço informado não é atendido por nenhuma das nossas lojas. Que tal tentar outro endereço?');
  await page.close();
});

});