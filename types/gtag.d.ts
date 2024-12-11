declare interface Window {
  gtag: (
    type: string,
    eventName: string,
    options?: {
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
}
