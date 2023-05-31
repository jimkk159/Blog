export const Sequelize = vi.fn().mockImplementation(() => ({
  sync: vi.fn(),
  authenticate: vi.fn().mockReturnThis(),
  then: vi.fn().mockReturnThis(),
  catch: vi.fn().mockReturnThis(),
  literal: vi.fn(),
  transaction: vi.fn().mockImplementation(async (fn) => fn()),
  define: vi.fn().mockImplementation(() => ({
    sync: vi.fn(),
    hasMany: vi.fn(),
    belongsTo: vi.fn(),
    findByPk: vi.fn(),
    findOne: vi.fn(),
    findAll: vi.fn(),
    findOrCreate: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
    count: vi.fn(),
    belongsToMany: vi.fn(),
  })),
}));

export const DataTypes = {
  INTEGER: vi.fn(),
  ENUM: vi.fn(),
  STRING: vi.fn(),
  TEXT: vi.fn(),
};
