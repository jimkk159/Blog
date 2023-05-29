const sequelizeMock = {
  define: vi.fn().mockImplementation(() => {
    return {
      sync: vi.fn(),
      hasMany: vi.fn(),
      belongsTo: vi.fn(),
      findByPk: vi.fn(),
      findAll: vi.fn(),
      findOrCreate: vi.fn(),
      update: vi.fn(),
      destroy: vi.fn(),
    };
  }),
  literal: vi.fn(),
  transaction: vi.fn(),
};

export default sequelizeMock;
