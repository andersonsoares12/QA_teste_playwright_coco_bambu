import { test, expect } from '@playwright/test';

test('Cadastro de usuário no Coco Bambu', async ({ page }) => {
  // Acessar a página inicial
  await page.goto('https://app-hom.cocobambu.com/on-boarding/delivery?nextPage=%2Fdelivery');

  // Validar que o texto esperado está visível
  await expect(page.getByText('Onde você quer receber seu')).toBeVisible();

  // Navegar até a página de login
  await page.locator('div').filter({ hasText: /^Perfil$/ }).click();
  await page.getByText('Entrar').click();

  // Iniciar o cadastro
  await page.getByText('Cadastre-se').click();

  // Preencher o formulário de cadastro
  await page.getByRole('textbox', { name: 'Nome completo' }).fill('Anderson Soares');
  await page.locator('#ion-input-5').fill('anderson@gmail.com');
  
  // Definir e confirmar senha
  await page.locator('#ion-input-6').fill('@As12no23');
  await page.getByRole('textbox', { name: 'Confirmar senha' }).fill('@As12no23');

  // Selecionar Estado
  await page.getByText('Selecione seu Estado').click();
  await page.getByRole('button', { name: 'Distrito Federal' }).click();

  // Aceitar os termos e cadastrar
  await page.locator('ion-checkbox').click();
  await page.getByRole('button', { name: 'ACEITAR' }).click();
  await page.getByRole('button', { name: 'CADASTRAR' }).click();

  // Fechar pop-up de confirmação
  await page.getByRole('button', { name: 'FECHAR' }).click();
});