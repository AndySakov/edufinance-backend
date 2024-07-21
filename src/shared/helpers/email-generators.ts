export const generateNewAdminEmail = (
  firstName: string,
  lastName: string,
  defaultPass: string,
): string => {
  return `
    <h2>Hello ${firstName} ${lastName},</h2>
    <p>A new admin account has been created for you.</p>
    <p>Your default password is: ${defaultPass}</p>
    <p>Please login to your account and change your password.</p>
    <p>Thank you for using our platform.</p>
  `;
};

export const generateNewStudentEmail = (
  firstName: string,
  lastName: string,
  defaultPass: string,
): string => {
  return `
    <h2>Hello ${firstName} ${lastName},</h2>
    <p>A new student account has been created for you.</p>
    <p>Your default password is: ${defaultPass}</p>
    <p>Please login to your account and change your password.</p>
    <p>Thank you for using our platform.</p>
  `;
};
