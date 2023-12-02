export type EnvironmentPreviewVariablesData =
  | {
      success: true
      duration: number;
      items: {
        key: string;
        value: string;
      }[];
    }
  | {
      success: false;
      duration: number;
      error?: string;
    };
