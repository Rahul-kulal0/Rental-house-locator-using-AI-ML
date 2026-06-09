export function getHouseImages(house) {
  const type = house.house_type?.toLowerCase() || "";

  if (type.includes("1 rk"))
    return [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb",
      "https://images.unsplash.com/photo-1560448071-8f31b87c4178",
    ];

  if (type.includes("1 bhk"))
    return [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600585154154-75b564ed97f5",
    ];

  if (type.includes("2 bhk"))
    return [
      "https://images.unsplash.com/photo-1586105445544-21c7a3d1cd49",
      "https://images.unsplash.com/photo-1560448071-8f31b87c4178",
      "https://images.unsplash.com/photo-1586105251261-72a756497a12",
    ];

  if (type.includes("3 bhk"))
    return [
      "https://images.unsplash.com/photo-1600573472591-ee34637a9796",
      "https://images.unsplash.com/photo-1599423300746-b62533397364",
      "https://images.unsplash.com/photo-1615874959474-d609969a20a1",
    ];

  if (type.includes("independent"))
    return [
      "https://images.unsplash.com/photo-1600607687920-4e3b21858219",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    ];

  // Default fallback
  return [
    "https://images.unsplash.com/photo-1600585154154-75b564ed97f5",
    "https://images.unsplash.com/photo-1600607682429-742391e2413c",
  ];
}
