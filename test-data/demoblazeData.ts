export function generateRandomUser() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  return {
    username: `qa_user_${timestamp}_${randomSuffix}`,
    password: `Pass@${timestamp}!`,
  };
}

export const demoblazeData = {
  products: {
    samsungGalaxyS6: {
      name: 'Samsung galaxy s6',
      price: 360,
      category: 'Phones',
    },
    sonyVaioI5: {
      name: 'Sony vaio i5',
      price: 790,
      category: 'Laptops',
    },
    appleMonitor: {
      name: 'Apple monitor 24',
      price: 400,
      category: 'Monitors',
    },
  },

  order: {
    name: 'Akshaya Kunduru',
    country: 'India',
    city: 'Bangalore',
    creditCard: '9876543210987654',
    month: '11',
    year: '2028',
  },

  invalidLogin: {
    nonExistentUser: `nonexistent_user_${Date.now()}`,
    wrongPassword: 'IncorrectPassword123!',
  },
};
