module.exports = {
  preencherOtpCampos: async function (page, otpPrefix, count, value) {
    for (let i = 0; i < count; i++) {
      const field = page.locator(`[id^="${otpPrefix}_${i}_"]`);
      await field.type(value);
      // await page.waitForTimeout(500);
    }
  }
};
