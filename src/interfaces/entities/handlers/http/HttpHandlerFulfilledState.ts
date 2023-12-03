export type HttpHandlerFulfilledState = {
  body: string | undefined;
  headers: Record<string, string>;

  status: number;
  statusText: string;
};
