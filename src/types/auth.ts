export interface ISession {
  id: string;
  device: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  type: "mobile" | "desktop" | "web";
}
