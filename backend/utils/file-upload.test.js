import fileUploadToServer from "./file-upload";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid"),
}));

describe("fileUploadToServer()", () => {
  beforeAll(() => {});

  test("should limit the file size", () => {
    expect(fileUploadToServer.limits).toBe(500000);
  });
  
  test("should setting the file destination", () => {
    let req, file;
    const cb = vi.fn();
    fileUploadToServer.storage.getDestination(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe("upload/images");
  });

  test("should setting the file filename", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/jpg" };
    fileUploadToServer.storage.getFilename(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe("mock-uuid.jpg");
  });

  test("should not response error to callback if file mime type is right", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/jpg" };
    fileUploadToServer.fileFilter(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe(true);
  });

  test("should response error to callback if file mime type is wrong", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/test" };
    fileUploadToServer.fileFilter(req, file, cb);
    expect(cb.mock.calls[0][0].message).toBe("Invalid mime type!");
    expect(cb.mock.calls[0][1]).toBe(false);
  });
});