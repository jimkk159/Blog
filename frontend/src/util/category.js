export const buildTree = (nodes, parentId = null) => {
  const tree = [];

  // 1) Create Tree by DFS
  nodes
    .filter((node) => node.ParentId === parentId)
    .forEach((node) => {
      // 2) Create Subtree
      const children = buildTree(nodes, node.id);
      if (children.length) node.children = children;
      else node.children = [];

      // 3) Add to the tree
      tree.push(node);
    });

  return tree;
};

export const createCatalogue = (posts, categories) => {
  categories.forEach((category) => {
    category.posts = posts
      .filter((post) => post.CategoryId === category.id)
  });
  return buildTree(categories)[0]
};
