const validationStrategies = {
  Twitter: (text) => text.length <= 280,

  LinkedIn: (text) => text.length <= 3000,

  Instagram: (text) => text.length <= 2200,
};

export default validationStrategies;