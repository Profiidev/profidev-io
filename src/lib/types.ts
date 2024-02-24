export type Dataset = {
  label: string;
  data: number[];
  fill: boolean;
  cubicInterpolationMode: string;
  tension: number;
};

export type UserColumn = {
  label: string;
  width: number;
};