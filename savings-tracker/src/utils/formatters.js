export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  export const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  };
  
  export const formatProgress = (current, target) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100);
  };
  
  export const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };