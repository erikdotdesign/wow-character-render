type Region = "us" | "eu" | "kr" | "tw";

declare module "*.svg" {
  const content: string;
  export default content;
}