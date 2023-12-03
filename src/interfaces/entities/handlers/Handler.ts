export type HandlerIdleState = {
  status: "idle";
};

export type HandlerStartedState = {
  status: "started";
};

export type HandlerErrorState = {
  status: "error";
  message: string;
};

export type HandlerFulfilledState<T> = {
  status: "fulfilled";
  data: T;
};

export type HandlerState<T> =
  | HandlerIdleState
  | HandlerStartedState
  | HandlerErrorState
  | HandlerFulfilledState<T>;

export default interface Handler<T = unknown> {
  readonly state: HandlerState<T>;

  execute(abortController: AbortController): Promise<void>;
}
