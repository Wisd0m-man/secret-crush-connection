
export const validateUSN = (usn: string) => {
  const usnRegex = /^4VP\d{2}[A-Z]{2}\d{3}$/;
  return usnRegex.test(usn);
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
