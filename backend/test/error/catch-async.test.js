import catchAsync from "../../utils/error/catch-async";

describe("catchAsync()", () => {
  let req, res, next, func;
  const error = new Error();

  beforeAll(() => {
    req = vi.fn();
    res = vi.fn();
    next = vi.fn();
    func = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should catch error if function throw error", async () => {
    func.mockRejectedValueOnce(error);

    const output = await catchAsync(func)(req, res, next);

    expect(func).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(output).toBeUndefined();
  });

  test("should not catch error if function work fine", async () => {
    func.mockResolvedValueOnce();

    const output = await catchAsync(func)(req, res, next);

    expect(func).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalledWith(error);
    expect(output).toBeUndefined();
  });
});
