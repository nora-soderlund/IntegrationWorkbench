"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
exports.collections = [
    {
        name: "Deliveries",
        repository: "commerce-delivery-service",
        folders: [
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
//# sourceMappingURL=collections.js.map