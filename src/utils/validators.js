export const cssLengthValidator = (value) => {
  const amount = parseInt(value, 10);
  const unit = value.match(/px|%|em/);

  return value === amount + unit;
};
