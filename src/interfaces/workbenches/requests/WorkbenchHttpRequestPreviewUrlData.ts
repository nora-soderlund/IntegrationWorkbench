export type WorkbenchHttpRequestPreviewUrlData =
  | {
      success: true
      duration: number;
      url: string;
    }
  | {
      success: false;
      duration: number;
    };
