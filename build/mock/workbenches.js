"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workbenches = void 0;
exports.workbenches = [
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
//# sourceMappingURL=workbenches.js.map