export default (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);

export const catchAsyncFunc =
  (func) =>
  (...args) =>
    Promise.resolve(func(...args)).catch(console.log);
