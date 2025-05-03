type Region = "us" | "eu" | "kr" | "tw";

type RegionDisplay = "US" | "EU" | "KR" | "TW";

declare module "*.svg" {
  const content: string;
  export default content;
}