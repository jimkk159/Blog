const options = { year: "numeric", month: "short", day: "numeric" };

export const DUMMY_Structure = [
  { id: 5, level: 4, topic: "React", parent: "Node" },
  { id: 7, level: 5, topic: "React-Router", parent: "React" },
  { id: 9, level: 5, topic: "Test22", parent: "Express" },
  { id: 6, level: 5, topic: "Redux", parent: "React" },
  { id: 0, level: 0, topic: "Root", parent: "" },
  { id: 8, level: 5, topic: "Test1", parent: "Express" },
  { id: 1, level: 1, topic: "CS", parent: "Root" },
  { id: 3, level: 3, topic: "Node", parent: "JS" },
  { id: 2, level: 2, topic: "JS", parent: "CS" },
  { id: 4, level: 4, topic: "Express", parent: "Node" },
  { id: 10, level: 5, topic: "Test333", parent: "Express" },
];

export const Dummy_users = [
];

export const Dummy_blogs = [
  {
    id: 0,
    topic: "React",
    type: "Problem",
    date: new Date("2022-11-28").toLocaleDateString("en-US", options),
    author: "Amy",
    isPined: true,
    tags: ["CS", "react", "vue", "python"],
    cover: {
      img: "",
      description: "公司在 wework 辦公時我非常喜歡他們的 slogan",
    },

    language: {
      en: {},
      ch: {
        title: "Test Title 1",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "當在衡量模型的表現結果 (performance) 時，會藉由評估指標來進行，本文將要介紹在影像分割 (Image Segmentation) 任務上經常使用的評估指標，並進行實作，所有 code 會放置在文章下方。",
          },
          {
            type: "section",
            content: {
              title: "Confusion Matrix",
              short:
                "Having worked across sites raking in over 50 billion website visits annually, I write about tech topics and teach engineers to have solid foundations that will help them get ahead in their career. I also build awesome products for digital nomads, check it out!",
              structure: [
                {
                  type: "description",
                  content:
                    "當在衡量模型的表現結果 (performance) 時，會藉由評估指標來進行，本文將要介紹在影像分割 (Image Segmentation) 任務上經常使用的評估指標，並進行實作，所有 code 會放置在文章下方。",
                },
                {
                  type: "list",
                  content: [
                    "TP (True Positive，真陽性)：該類別實際為有病，預測也為有病，表示檢測正確",
                    "FP (False Positive，真陰性)：該類別實際為沒有病，預測成有病，表示誤檢",
                    "FN (False Negative，假陰性)：該類別實際為有病，預測為沒有病，表示漏檢",
                    "TN (TrueNegative，假陽性)：該類別實際為沒有病，預測也為沒有病，即表示不需要被檢測的地方沒被檢測出來",
                  ],
                },
              ],
            },
          },
          {
            type: "description",
            content:
              "混淆矩陣 (Confusion Matrix) 是由 TP、FP、FN、TN 四種狀況所組合而成，可以很清楚地反映各類別之間被劃分的關係，並且藉由confusion matrix 可以再延伸出其他評估指標。",
          },
          {
            type: "description",
            content:
              "來看一下 TP、FP、FN、TN的定義，假設我們要預測的類別有兩個類別，分別為有病 (label=1) 以及沒病(label=0)",
          },
          {
            type: "list",
            content: [
              "TP (True Positive，真陽性)：該類別實際為有病，預測也為有病，表示檢測正確",
              "FP (False Positive，真陰性)：該類別實際為沒有病，預測成有病，表示誤檢",
              "FN (False Negative，假陰性)：該類別實際為有病，預測為沒有病，表示漏檢",
              "TN (TrueNegative，假陽性)：該類別實際為沒有病，預測也為沒有病，即表示不需要被檢測的地方沒被檢測出來",
            ],
          },
          {
            type: "img",
            alt: "Post-img",
            content: {
              img: "",
              description: "Happy Girl",
            },
          },
          {
            type: "seperation",
          },
          {
            type: "emphasize",
            content: "Emphasize Title",
          },
        ],
      },
    },
  },
  {
    id: 1,
    topic: "Node",
    type: "Post",
    date: new Date("2022-10-15").toLocaleDateString("en-US", options),
    author: "Jim",
    isPined: true,
    tags: ["CS", "react", "vue", "python"],
    cover: {
      img: "",
      description: "公司在 wework 辦公時我非常喜歡他們的 slogan",
    },
    language: {
      en: {
        title: "Test Title 2",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {
        title: "中文測試標題2",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "當在衡量模型的表現結果 (performance) 時，會藉由評估指標來進行，本文將要介紹在影像分割 (Image Segmentation) 任務上經常使用的評估指標，並進行實作，所有 code 會放置在文章下方。",
          },
        ],
      },
    },
  },
  {
    id: 2,
    topic: "CS",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 3",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {
        title: "中文測試標題 3",
        support: true,
        short:
          "中文測試標題 中文測試標題 中文測試標題 中文測試標題 中文測試標題 ",
        structure: [
          {
            type: "description",
            content:
              "中文測試標題 中文測試標題 中文測試標題 中文測試標題 中文測試標題 ",
          },
        ],
      },
    },
  },
  {
    id: 3,
    topic: "CS",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 4",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 4,
    topic: "Python",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 5",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 5,
    topic: "Vue",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 6",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 6,
    topic: "Python",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 7",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 7,
    topic: "Book",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 8",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 8,
    topic: "Vue",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 9",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 9,
    topic: "Vue",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 10",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 10,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 11",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 11,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 12",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 12,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 13",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 13,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 14",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 14,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 15",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 15,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 16",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 16,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 17",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 17,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 18",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 18,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 19",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 19,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 20",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 20,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 21",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 21,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 22",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 22,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 23",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 23,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 24",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 24,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 25",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 25,
    topic: "",
    type: "",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {
        title: "Test Title 26",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
          },
        ],
      },
      ch: {},
    },
  },
];

export const Dummy_search = [
  {
    id: 0,
    topic: "React",
    type: "Problem",
    date: new Date("2022-11-28").toLocaleDateString("en-US", options),
    author: "Amy",
    isPined: true,
    tags: ["CS", "react", "vue", "python"],
    cover: {
      img: "",
      description: "公司在 wework 辦公時我非常喜歡他們的 slogan",
    },
    language: {
      en: {},
      ch: {
        title: "Search Title 1",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "當在衡量模型的表現結果 (performance) 時，會藉由評估指標來進行，本文將要介紹在影像分割 (Image Segmentation) 任務上經常使用的評估指標，並進行實作，所有 code 會放置在文章下方。",
          },
        ],
      },
    },
  },
  {
    id: 1,
    topic: "Node",
    type: "Post",
    date: new Date("2022-10-15").toLocaleDateString("en-US", options),
    author: "Jim",
    isPined: true,
    tags: ["CS", "react", "vue", "python"],
    cover: {
      img: "",
      description: "公司在 wework 辦公時我非常喜歡他們的 slogan",
    },
    language: {
      en: {
        title: "Search Title 2",
        support: true,
        short:
          "React is a popular JavaScript library for building user interfaces, and it has a strong ecosystem of tools, libraries, and best practices that can help developers build efficient and maintainable applications. Here are some best practices to keep in mind when working with React",
        structure: [
          {
            type: "description",
            content:
              "當在衡量模型的表現結果 (performance) 時，會藉由評估指標來進行，本文將要介紹在影像分割 (Image Segmentation) 任務上經常使用的評估指標，並進行實作，所有 code 會放置在文章下方。",
          },
        ],
      },
      ch: {},
    },
  },
  {
    id: 2,
    topic: "Node",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 3,
    topic: "Node",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 4,
    topic: "JS",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 5,
    topic: "JS",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 6,
    topic: "CS",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 7,
    topic: "Book",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 8,
    topic: "Food",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 9,
    topic: "Book",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
  {
    id: 10,
    topic: "Food",
    type: "Post",
    date: new Date("2022-7-01").toLocaleDateString("en-US", options),
    author: "Bob",
    isPined: false,
    tags: [],
    cover: {
      img: null,
      description: "",
    },
    language: {
      en: {},
      ch: {},
    },
  },
];
