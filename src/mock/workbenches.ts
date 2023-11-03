import { Workbench } from "../interfaces/workbenches/Workbench";

export const workbenches: Workbench[] = [
    {
        name: "Deliveries",
        repository: "commerce-delivery-service",
        collections: [
            {
                name: "Statuses",
                requests: [
                    {
                        name: "GetOrderDeliveryStatus",
                        type: "HTTP",
                        method: "GET"
                    },

                    {
                        name: "CreateOrderDeliveryStatus",
                        type: "HTTP",
                        method: "POST"
                    },

                    {
                        name: "ReplaceOrderDeliveryStatus",
                        type: "HTTP",
                        method: "PUT"
                    },

                    {
                        name: "UpdateOrderDeliveryStatus",
                        type: "HTTP",
                        method: "PATCH"
                    },

                    {
                        name: "DeleteOrderDeliveryStatus",
                        type: "HTTP",
                        method: "DELETE"
                    }
                ]
            }
        ]
    }
];