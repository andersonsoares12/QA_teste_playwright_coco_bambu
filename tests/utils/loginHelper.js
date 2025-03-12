// Função para realizar o login no sistema
import { preencherOtpCampos } from '../utils/otpHelper.js';

export async function realizarLogin(page, email, password, otpPrefix, otpFieldsCount, otpValue) {
  // Clicar no botão "Entrar"
  await page.getByText('Entrar').click();

  // Preencher os campos de login
  await page.getByRole('textbox', { name: 'E-mail' }).fill(email);
  await page.getByRole('textbox', { name: 'Senha' }).fill(password);

  // Submeter o formulário de login
  await page.getByRole('button', { name: 'ENTRAR' }).click();

  // Fechar qualquer pop-up/modal
  await page.getByRole('button', { name: 'FECHAR' }).click();

  // Preencher os campos OTP usando a função importada
  await preencherOtpCampos(page, otpPrefix, otpFieldsCount, otpValue);

  // Submeter o formulário OTP
  await page.getByRole('button', { name: 'ACESSAR' }).click();
}
