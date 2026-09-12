// ------------------------------------------------------
// Async Controller Handler
//
// Express controllers frequently use async/await.
// This wrapper automatically forwards rejected promises
// to the global error middleware.
// ------------------------------------------------------

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(
      requestHandler(req, res, next)
    ).catch(next);
  };
};

export default asyncHandler;