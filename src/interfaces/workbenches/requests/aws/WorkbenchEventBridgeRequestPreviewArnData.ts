export type WorkbenchEventBridgeRequestPreviewArnData =
  | {
      success: true
      duration: number;
      eventBridgeArn: string;
    }
  | {
      success: false;
      duration: number;
      error?: string;
    };
