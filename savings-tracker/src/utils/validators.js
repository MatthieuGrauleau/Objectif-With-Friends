export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validateAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  };
  
  export const validateGroupName = (name) => {
    return name.trim().length >= 3;
  };
  
  export const validateTargetDate = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    return targetDate > today;
  };