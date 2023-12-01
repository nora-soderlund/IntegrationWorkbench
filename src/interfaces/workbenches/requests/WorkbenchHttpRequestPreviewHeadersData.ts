export type WorkbenchHttpRequestPreviewHeadersData =
  | {
      success: true
      duration: number;
      headers: {
        key: string;
        value: string;
      }[];
    }
  | {
      success: false;
      duration: number;
      error?: string;
    };
