 export default getCurrentEvaluationPeriod = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1
  
    let quarter;
  
    if (currentMonth >= 1 && currentMonth <= 3) {
      quarter = 'Q1';
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      quarter = 'Q2';
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      quarter = 'Q3';
    } else {
      quarter = 'Q4';
    }
  
    return `${currentYear}-${quarter}`;
  };