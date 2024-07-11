export const generateNewAdminEmail = (
  firstName: string,
  lastName: string,
  defaultPass: string,
): string => {
  return `
    <p>Hello ${firstName} ${lastName},</p>
    <p>A new admin account has been created for you.</p>
    <p>Your new password is: ${defaultPass}</p>
    <p>Please login to your account and change your password.</p>
    <p>Thank you for using our platform.</p>
  `;
};
