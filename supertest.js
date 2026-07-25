const request = require("supertest");
const app = require("../server"); // your Express app

describe("RBAC + CRUD", () => {
    let adminToken;
    let employeeToken;

    beforeAll(async () => {
        // login admin
        const adminRes = await request(app)
            .post("/auth/login")
            .send({ username: "admin", password: "admin123" });

        adminToken = adminRes.body.token;

        // login employee
        const empRes = await request(app)
            .post("/auth/login")
            .send({ username: "employee", password: "employee123" });

        employeeToken = empRes.body.token;
    });

    test("Admin can create supplier order", async () => {
        const res = await request(app)
            .post("/supplier-orders")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                supplier_id: 1,
                items: [
                    { book_id: 1, quantity: 5, unit_cost: 10 }
                ]
            });

        expect(res.status).toBe(200);
        expect(res.body.supplier_order_id).toBeDefined();
    });

    test("Employee cannot create supplier order without permission", async () => {
        const res = await request(app)
            .post("/supplier-orders")
            .set("Authorization", `Bearer ${employeeToken}`)
            .send({
                supplier_id: 1,
                items: [
                    { book_id: 1, quantity: 5, unit_cost: 10 }
                ]
            });

        expect(res.status).toBe(403);
    });
});
