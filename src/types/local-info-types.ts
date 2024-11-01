export type LocalInfo = LocalInfoHost | LocalInfoTaster | LocalInfoDisconnected;

export type Wine = {
  identifier: string;
  name: string;
  year: number;
  varietal: string;
  region: string;
  price: number;
  points: number;
  flavors: string[];
};

export type WineTasting = {
  nickname: string;
  notes: string;
  points: number;
  price: number;
  flavors: string[];
};

export type LocalInfoTaster = {
  type: "taster";
  name: string;
  gender?: "M" | "F";
  age?: number;
  wineExperience?: "none" | "some" | "lots";
  winesToTaste: Wine[];
  wineTastings: WineTasting[];
};

export type LocalInfoHost = {
  type: "host";
  wines: Wine[];
  tasters: Record<string, LocalInfoTaster | {}>;
  qrId: string;
  qrPwd: string;
};

export type LocalInfoDisconnected = {
  type: "none";
};
