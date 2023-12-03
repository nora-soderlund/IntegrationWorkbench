export type WorkbenchHttpRequestPreviewHeadersData =
  | {
      success: true
      duration: number;
      headers: Record<string, string>;
    }
  | {
      success: false;
      duration: number;
      error?: string;
    };
