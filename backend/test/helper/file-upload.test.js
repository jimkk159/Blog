import * as upload from "./file-upload";
import multer from "multer";

vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid"),
}));

describe("uploadToLocal()", () => {
  beforeAll(() => {});

  test("should limit the file size", () => {
    expect(upload.uploadToLocal.limits).toBe(500000);
  });

  test("should setting the file destination", () => {
    let req, file;
    const cb = vi.fn();
    upload.uploadToLocal.storage.getDestination(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe("upload/images");
  });

  test("should setting the file filename", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/jpg" };
    upload.uploadToLocal.storage.getFilename(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe("mock-uuid.jpg");
  });

  test("should not response error to callback if file mime type is right", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/jpg" };
    upload.uploadToLocal.fileFilter(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe(true);
  });

  test("should response error to callback if file mime type is wrong", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/test" };
    upload.uploadToLocal.fileFilter(req, file, cb);
    expect(cb.mock.calls[0][0].message).toBe("Invalid mime type!");
    expect(cb.mock.calls[0][1]).toBe(false);
  });
});

describe("uploadToMemory()", () => {
  beforeAll(() => {
    vi.spyOn(multer, "memoryStorage").mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should limit the file size", () => {
    expect(upload.uploadToMemory.limits).toBe(500000);
  });

  test("should not response error to callback if file mime type is right", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/jpg" };
    upload.uploadToLocal.fileFilter(req, file, cb);
    expect(cb.mock.calls[0][0]).toBeNull();
    expect(cb.mock.calls[0][1]).toBe(true);
  });

  test("should response error to callback if file mime type is wrong", () => {
    let req;
    const cb = vi.fn();
    const file = { mimetype: "image/test" };
    upload.uploadToMemory.fileFilter(req, file, cb);
    expect(cb.mock.calls[0][0].message).toBe("Invalid mime type!");
    expect(cb.mock.calls[0][1]).toBe(false);
  });
});
