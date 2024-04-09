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

export type FileData = {
  name: string;
  dir: boolean;
  write: boolean;
};

export type FileUpload = {
  path: string;
  isDir: boolean;
  file: File | undefined;
}