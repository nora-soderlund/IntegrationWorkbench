export type WorkbenchHttpRequestData = {
  id: string;
  name: string;
  type: "HTTP";
  
  data: {
    method?: string;
    url?: string;
  };
};
