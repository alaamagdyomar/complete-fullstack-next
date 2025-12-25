const generateTTL = (tokenExpiry: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const secondsToExpire = tokenExpiry - currentTime;
  return secondsToExpire > 0 ? secondsToExpire : 0;
};

const generateRadisKey = (id: string) => {
  return "user-" + id;
};

export { generateRadisKey, generateTTL };
