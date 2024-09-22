export interface TypesTodo {
  message: string;
  success: boolean;
  data: Data[];
}

export interface Data {
  _id: string;
  title: string;
  description: string;
}
