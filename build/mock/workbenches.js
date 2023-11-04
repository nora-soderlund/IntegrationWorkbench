"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workbenches = void 0;
exports.workbenches = [
    {
        name: "Deliveries",
        storage: {
            location: "user",
            base: "commerce-delivery-service"
        },
        collections: [
            {
                name: "Statuses",
                requests: [
                    {
                        id: "abcd-efgh",
                        name: "GetOrderDeliveryStatus",
                        type: "HTTP",
                        details: {
                            method: "GET"
                        }
                    },
                    {
                        id: "abcd-efgh-2",
                        name: "CreateOrderDeliveryStatus",
                        type: "HTTP",
                        details: {
                            method: "POST"
                        }
                    },
                    {
                        id: "abcd-efgh-3",
                        name: "ReplaceOrderDeliveryStatus",
                        type: "HTTP",
                        details: {
                            method: "PUT"
                        }
                    },
                    {
                        id: "abcd-efgh-4",
                        name: "UpdateOrderDeliveryStatus",
                        type: "HTTP",
                        details: {
                            method: "PATCH"
                        }
                    },
                    {
                        id: "abcd-efgh-5",
                        name: "DeleteOrderDeliveryStatus",
                        type: "HTTP",
                        details: {
                            method: "DELETE"
                        }
                    }
                ]
            }
        ]
    }
];
//# sourceMappingURL=workbenches.js.map