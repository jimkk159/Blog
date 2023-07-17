export default {
  createClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockImplementation(async () => {}),
  })),
};
