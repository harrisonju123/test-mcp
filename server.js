// mcp-server.js
import {FastMCP} from "fastmcp";   // Fast MCP framework (v1.x)  [oai_citation:0‡stackoverflow.com](https://stackoverflow.com/questions/79607756/fastmcp-sse-port-control?utm_source=chatgpt.com) [oai_citation:1‡github.com](https://github.com/punkpeye/fastmcp?utm_source=chatgpt.com)
import { z } from "zod";         // Zod schemas for input/output

// 1) Create a new Fast MCP server instance
const server = new FastMCP({
    name: "PaymentStatusMCP",
    version: "1.0.0",
});

// 2) Define each tool’s input/output schema and implementation

// --- HelloWorld ---
/**
 * Input:  {}
 * Output: { text: string }
 */
const HelloWorldDef = {
    name: "HelloWorld",
    description: "Returns a simple hello-world message.",
    parameters: z.object({}),            // no inputs
    execute: async () => {
        return { text: "hello world" };
    },
};

// --- GetPaymentStatus ---
/**
 * Input:  { employee_id: string }
 * Output: { employee_id: string, payment_id: string, status: string }
 */
const GetPaymentStatusDef = {
    name: "GetPaymentStatus",
    description: "Fetches payment info for a given employee.",
    parameters: z.object({
        employee_id: z.string(),
    }),
    execute: async (args) => {
        // In production, replace this with a DB/API lookup using args.employee_id
        return {
            employee_id: args.employee_id,
            payment_id: "pmt123",
            status: "sent",
        };
    },
};

// --- GetClearingStatus ---
/**
 * Input:  { payment_id: string }
 * Output: { payment_id: string, cleared: boolean }
 */
const GetClearingStatusDef = {
    name: "GetClearingStatus",
    description: "Check if the payment cleared with the bank.",
    parameters: z.object({
        payment_id: z.string(),
    }),
    execute: async (args) => {
        // Dummy logic—always returns false for cleared
        return {
            payment_id: args.payment_id,
            cleared: false,
        };
    },
};

// --- RequestReissue ---
/**
 * Input:  {}
 * Output: { status: string, request_id: string }
 */
const RequestReissueDef = {
    name: "RequestReissue",
    description: "Request a payment reissue via ops.",
    parameters: z.object({}),            // no inputs
    execute: async () => {
        // Dummy logic—pretend we asked Ops to reissue
        return {
            status: "reissue_requested",
            request_id: "ops456",
        };
    },
};

// 3) Register each tool with the Fast MCP server
server.addTool(HelloWorldDef);
server.addTool(GetPaymentStatusDef);
server.addTool(GetClearingStatusDef);
server.addTool(RequestReissueDef);

// 4) Start the MCP server using SSE transport on port 3001, path "/mcp"
(async () => {
    try {
        await server.start({
            transportType: "stdio",          // Use SSE (Server-Sent Events)  [oai_citation:2‡stackoverflow.com](https://stackoverflow.com/questions/79607756/fastmcp-sse-port-control?utm_source=chatgpt.com)
            cors: true,
        });
        console.log("✅ Fast MCP server running at http://localhost:3001/mcp");
    } catch (err) {
        console.error("Failed to start MCP server:", err);
    }
})();