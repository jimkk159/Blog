export const categories = [
  {
    id: 1,
    name: "root",
    ParentId: null,
  },
  {
    id: 2,
    name: "Music",
    ParentId: 1,
  },
  {
    id: 3,
    name: "Lofi",
    ParentId: 2,
  },
  {
    id: 4,
    name: "Lofi Girl",
    ParentId: 3,
  },
  {
    id: 5,
    name: "Sport",
    ParentId: 1,
  },
  {
    id: 6,
    name: "Book",
    ParentId: 1,
  },
];

export const posts = [
  {
    title: "Lofi Girl1",
    Category: { name: "Music" },
    thumbs: 1,
    comments: 1,
    updatedAt: "1993-03-04",
    summary:
      "'Lofi Girl' is a mesmerizing subgenre of music that encapsulates the essence of tranquility and relaxation. With its distinctive lofi style, this genre creates a soothing atmosphere through mellow beats, gentle instrumentals, and cozy soundscapes. Its popularity has soared in recent years, captivating listeners with its nostalgic charm and calming vibes.",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/9MhHJaFsnuc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDkgLih_MA8=&rs=AOn4CLB1Q8rOm8mqkhIa1jwR8FBCxckvXw",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title:
      "Unlocking the Secrets of Time Travel: A Journey Through the Unknown",
    thumbs: 8,
    comments: 2,
    Category: { name: "Science" },
    updatedAt: "1994-03-04",
    summary:
      "One of the defining features of 'Lofi Girl' is its simplicity. The tracks often consist of lo-fi beats layered with sampled melodies from jazz, soul, or vintage recordings. These samples are carefully curated to evoke a sense of nostalgia, taking listeners on a journey back in time. The warm crackle of vinyl and the subtle imperfections in the sound contribute to the overall charm and authenticity of the music.",
    Author: {
      name: "Olivia Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    previewImg:
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    Tags: [{ name: "Time Machine" }, { name: "Dark Hole" }],
  },
  {
    title:
      "Exploring the Mysteries of the Deep Sea: Unveiling the Hidden Wonders",
    thumbs: 6,
    comments: 4,
    Category: { name: "Financial" },
    updatedAt: "2012-03-16",
    summary:
      "The visual element is an integral part of the 'Lofi Girl' experience. The most iconic representation is the looping animation of a girl studying or working at her desk, often accompanied by cozy and aesthetically pleasing backgrounds. This visual adds an extra layer of immersion, inviting listeners to step into the world of the 'Lofi Girl' and feel a sense of companionship.",
    Author: {
      name: "Ava Martinez",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
    },
    previewImg:
      "https://images.unsplash.com/photo-1607796884038-3638822d5ee2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    Tags: [{ name: "Unknow Fear" }, { name: "Sea" }],
  },
  {
    title: "Lofi Girl2",
    Category: { name: "Music" },
    thumbs: 2,
    comments: 2,
    updatedAt: "2012-04-16",
    summary:
      "'Lofi Girl' has gained immense popularity through various streaming platforms, particularly YouTube, where live streams featuring the animation and continuous mixes are broadcasted. These streams have become a digital gathering place for fans of the genre, fostering a sense of community and shared appreciation for the music. Listeners often engage in the chat section, exchanging messages and expressing their gratitude for the calming and inspiring vibes provided by 'Lofi Girl.'",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/8r4bqa9mHWg/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl3",
    Category: { name: "Music" },
    thumbs: 3,
    comments: 3,
    updatedAt: "2022-05-10",
    summary:
      "Beyond its immediate appeal, 'Lofi Girl' has also had a broader cultural impact. Its influence can be observed in various media forms, such as video games, podcasts, and even fashion. Many creators have integrated lofi beats into their content, recognizing its ability to create an atmosphere that resonates with audiences.",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/2TvhRJweMuo/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title:
      "Mastering the Art of Mindfulness: Finding Inner Peace in a Hectic World",
    Category: { name: "Sport" },
    thumbs: 4,
    comments: 4,
    updatedAt: "2020-04-10",
    summary:
      "In conclusion, 'Lofi Girl' is a captivating and immersive musical genre that embraces simplicity, warmth, and nostalgia. Through its mellow beats, gentle instrumentals, and cozy soundscapes, it offers solace and relaxation to listeners seeking a break from the fast-paced world. With its iconic visual animation and continuous streaming presence, 'Lofi Girl' has become a beloved cultural phenomenon, fostering a sense of community and providing a haven of tranquility in the digital landscape. So, sit back, unwind, and allow yourself to be carried away by the enchanting charm of 'Lofi Girl.'",
    Author: {
      name: "Lucas Ramirez",
      avatar:
        "https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    previewImg:
      "https://images.unsplash.com/photo-1590506357340-4f2d8f5da5cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
    Tags: [{ name: "Peace" }],
  },
  {
    title:
      "The Future of Artificial Intelligence: Advancements and Ethical Implications",
    thumbs: 5,
    comments: 20,
    Category: { name: "Music" },
    updatedAt: "2018-05-10",
    summary:
      "In conclusion, 'Lofi Girl' is a captivating and immersive musical genre that embraces simplicity, warmth, and nostalgia. Through its mellow beats, gentle instrumentals, and cozy soundscapes, it offers solace and relaxation to listeners seeking a break from the fast-paced world. With its iconic visual animation and continuous streaming presence, 'Lofi Girl' has become a beloved cultural phenomenon, fostering a sense of community and providing a haven of tranquility in the digital landscape. So, sit back, unwind, and allow yourself to be carried away by the enchanting charm of 'Lofi Girl.'",
    Author: {
      name: "Mason Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80",
    },
    previewImg:
      "https://images.unsplash.com/photo-1672872476232-da16b45c9001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    Tags: [],
  },
  {
    title: "Lofi Girl4",
    Category: { name: "Music" },
    thumbs: 4,
    comments: 4,
    updatedAt: "2018-05-18",
    summary:
      "In conclusion, 'Lofi Girl' is a captivating and immersive musical genre that embraces simplicity, warmth, and nostalgia. Through its mellow beats, gentle instrumentals, and cozy soundscapes, it offers solace and relaxation to listeners seeking a break from the fast-paced world. With its iconic visual animation and continuous streaming presence, 'Lofi Girl' has become a beloved cultural phenomenon, fostering a sense of community and providing a haven of tranquility in the digital landscape. So, sit back, unwind, and allow yourself to be carried away by the enchanting charm of 'Lofi Girl.'",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/-cswlH1laHc/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl5",
    Category: { name: "Music" },
    thumbs: 5,
    comments: 5,
    updatedAt: "2018-04-10",
    summary:
      "'Lofi Girl' has gained immense popularity through various streaming platforms, particularly YouTube, where live streams featuring the animation and continuous mixes are broadcasted. These streams have become a digital gathering place for fans of the genre, fostering a sense of community and shared appreciation for the music. Listeners often engage in the chat section, exchanging messages and expressing their gratitude for the calming and inspiring vibes provided by 'Lofi Girl.'",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/8BAl6z0lXdw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBIgYyhyMA8=&rs=AOn4CLBD1P_dhEIHLAVyschlBQstn9uk4Q",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl6",
    Category: { name: "Music" },
    thumbs: 6,
    comments: 6,
    updatedAt: "2023-04-10",
    summary:
      "'Lofi Girl' has gained immense popularity through various streaming platforms, particularly YouTube, where live streams featuring the animation and continuous mixes are broadcasted. These streams have become a digital gathering place for fans of the genre, fostering a sense of community and shared appreciation for the music. Listeners often engage in the chat section, exchanging messages and expressing their gratitude for the calming and inspiring vibes provided by 'Lofi Girl.'",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/F6Dew1zwff0/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl7",
    Category: { name: "Music" },
    thumbs: 7,
    comments: 7,
    updatedAt: "2018-05-18",
    summary:
      "One of the defining features of 'Lofi Girl' is its simplicity. The tracks often consist of lo-fi beats layered with sampled melodies from jazz, soul, or vintage recordings. These samples are carefully curated to evoke a sense of nostalgia, taking listeners on a journey back in time. The warm crackle of vinyl and the subtle imperfections in the sound contribute to the overall charm and authenticity of the music.",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/Brp6s59_Ssk/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGCsgayhyMA8=&rs=AOn4CLAUv6qHCqq2HBsbS8Ce8o-bK3O8sA",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl8",
    Category: { name: "Music" },
    thumbs: 8,
    comments: 8,
    updatedAt: "2018-04-10",
    summary:
      "One of the defining features of 'Lofi Girl' is its simplicity. The tracks often consist of lo-fi beats layered with sampled melodies from jazz, soul, or vintage recordings. These samples are carefully curated to evoke a sense of nostalgia, taking listeners on a journey back in time. The warm crackle of vinyl and the subtle imperfections in the sound contribute to the overall charm and authenticity of the music.",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/8BAl6z0lXdw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBIgYyhyMA8=&rs=AOn4CLBD1P_dhEIHLAVyschlBQstn9uk4Q",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl9",
    Category: { name: "Music" },
    thumbs: 9,
    comments: 9,
    updatedAt: "2023-04-10",
    summary:
      "One of the defining features of 'Lofi Girl' is its simplicity. The tracks often consist of lo-fi beats layered with sampled melodies from jazz, soul, or vintage recordings. These samples are carefully curated to evoke a sense of nostalgia, taking listeners on a journey back in time. The warm crackle of vinyl and the subtle imperfections in the sound contribute to the overall charm and authenticity of the music.",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/X1roiHm1kIA/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl10",
    Category: { name: "Music" },
    thumbs: 10,
    comments: 10,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/e2QorSnzj2w/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl11",
    Category: { name: "Music" },
    thumbs: 11,
    comments: 11,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/2qfH4sSkme0/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGCwgSyh_MA8=&rs=AOn4CLCHePcWzV0pCAqQcMTLDENigHHAwA",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl12",
    Category: { name: "Music" },
    thumbs: 12,
    comments: 12,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/JbztzxpS4Po/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl13",
    Category: { name: "Music" },
    thumbs: 13,
    comments: 13,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/5rccGwBIH98/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl14",
    Category: { name: "Music" },
    thumbs: 14,
    comments: 14,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/hDH2BXWbCII/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl15",
    Category: { name: "Music" },
    thumbs: 15,
    comments: 15,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/9XJXZcGZGH0/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl16",
    Category: { name: "Music" },
    thumbs: 16,
    comments: 16,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/tNpVdbtHkWk/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl17",
    Category: { name: "Music" },
    thumbs: 17,
    comments: 17,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/0SG41mY0AE8/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl18",
    Category: { name: "Music" },
    thumbs: 18,
    comments: 18,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/IjVz0jKEH9o/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl19",
    Category: { name: "Music" },
    thumbs: 19,
    comments: 19,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/ZElr9bUZtd4/mqdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl20",
    Category: { name: "Music" },
    thumbs: 20,
    comments: 20,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/9XJXZcGZGH0/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl1",
    Category: { name: "Music" },
    thumbs: 1,
    comments: 1,
    updatedAt: "1993-03-04",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/9MhHJaFsnuc/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDkgLih_MA8=&rs=AOn4CLB1Q8rOm8mqkhIa1jwR8FBCxckvXw",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl2",
    Category: { name: "Music" },
    thumbs: 2,
    comments: 2,
    updatedAt: "2012-04-16",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/8r4bqa9mHWg/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl3",
    Category: { name: "Music" },
    thumbs: 3,
    comments: 3,
    updatedAt: "2022-05-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/2TvhRJweMuo/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl4",
    Category: { name: "Music" },
    thumbs: 4,
    comments: 4,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/-cswlH1laHc/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl5",
    Category: { name: "Music" },
    thumbs: 5,
    comments: 5,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/8BAl6z0lXdw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBIgYyhyMA8=&rs=AOn4CLBD1P_dhEIHLAVyschlBQstn9uk4Q",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl6",
    Category: { name: "Music" },
    thumbs: 6,
    comments: 6,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/F6Dew1zwff0/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl7",
    Category: { name: "Music" },
    thumbs: 7,
    comments: 7,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/Brp6s59_Ssk/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGCsgayhyMA8=&rs=AOn4CLAUv6qHCqq2HBsbS8Ce8o-bK3O8sA",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl8",
    Category: { name: "Music" },
    thumbs: 8,
    comments: 8,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/8BAl6z0lXdw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGBIgYyhyMA8=&rs=AOn4CLBD1P_dhEIHLAVyschlBQstn9uk4Q",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl9",
    Category: { name: "Music" },
    thumbs: 9,
    comments: 9,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/X1roiHm1kIA/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl10",
    Category: { name: "Music" },
    thumbs: 10,
    comments: 10,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/e2QorSnzj2w/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl11",
    Category: { name: "Music" },
    thumbs: 11,
    comments: 11,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg:
      "https://i.ytimg.com/vi/2qfH4sSkme0/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGCwgSyh_MA8=&rs=AOn4CLCHePcWzV0pCAqQcMTLDENigHHAwA",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl12",
    Category: { name: "Music" },
    thumbs: 12,
    comments: 12,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/JbztzxpS4Po/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl13",
    Category: { name: "Music" },
    thumbs: 13,
    comments: 13,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/5rccGwBIH98/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl14",
    Category: { name: "Music" },
    thumbs: 14,
    comments: 14,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/hDH2BXWbCII/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl15",
    Category: { name: "Music" },
    thumbs: 15,
    comments: 15,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/9XJXZcGZGH0/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl16",
    Category: { name: "Music" },
    thumbs: 16,
    comments: 16,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/tNpVdbtHkWk/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl17",
    Category: { name: "Music" },
    thumbs: 17,
    comments: 17,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/0SG41mY0AE8/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl18",
    Category: { name: "Music" },
    thumbs: 18,
    comments: 18,
    updatedAt: "2018-05-18",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/IjVz0jKEH9o/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl19",
    Category: { name: "Music" },
    thumbs: 19,
    comments: 19,
    updatedAt: "2018-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/ZElr9bUZtd4/mqdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
  {
    title: "Lofi Girl20",
    Category: { name: "Music" },
    thumbs: 20,
    comments: 20,
    updatedAt: "2023-04-10",
    Author: {
      name: "Sweet Girl",
      avatar:
        "https://yt3.ggpht.com/94BDPPz2faTLym08SATAlVgC0yEDo3sHXpiN1HP_I_yKI5dc3xk2PcUEtgtOpc_qZya_Ga4TixA=s48-c-k-c0x00ffffff-no-rj",
    },
    previewImg: "https://i.ytimg.com/vi/9XJXZcGZGH0/maxresdefault.jpg",
    Tags: [{ name: "Lofi" }, { name: "Lofi Girl" }],
  },
];
