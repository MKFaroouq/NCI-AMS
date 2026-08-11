const axios = require("axios");

const BASE_URL = "http://localhost:8000/api";

async function runStressTest() {
    try {

        console.log("=================================");
        console.log("NCI-Q Concurrent Approve Stress Test");
        console.log("=================================");

        // =========================================
        // 1. Login
        // =========================================

        console.log("Logging in...");

        const loginResponse = await axios.post(
            `${BASE_URL}/auth/login`,
            {
                // حط بيانات الـ admin بتاعتك هنا
                username: "DataEntry",
                password: "123"
            }
        );

        const token = loginResponse.data.data.token;
        console.log("Token received." , token);
        console.log("Token received:", !!token);

        console.log("Login successful.", loginResponse.data);
        console.log(
    "LOGIN RESPONSE:",
    JSON.stringify(loginResponse.data, null, 2)
);

        // =========================================
        // 2. Get bookings
        // =========================================

        const bookingsResponse = await axios.get(
            `${BASE_URL}/bookings`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                
            }
        );
            console.log(
            "BOOKINGS RESPONSE:",
            JSON.stringify(bookingsResponse.data, null, 2)
);

        const bookings = bookingsResponse.data.data;
        console.log(bookings.length);
        console.log(`Found ${bookings.length} bookings.`);

        // =========================================
        // 3. Take 200 pending bookings
        // =========================================

        const pendingBookings = bookings
            .filter((booking) => booking.status === "pending")
            .slice(0, 200);

        console.log(
            `Pending bookings selected: ${pendingBookings.length}`
        );

        // =========================================
        // 4. Send concurrent approve requests
        // =========================================

        console.log(
            `Sending ${pendingBookings.length} concurrent approve requests...`
        );

        const requests = pendingBookings.map((booking) => {

            return axios.patch(
                `${BASE_URL}/bookings/${booking._id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    validateStatus: () => true
                }
            );
        });

        const results = await Promise.all(requests);

        // =========================================
        // 5. Analyze results
        // =========================================

        const successful = results.filter(
            (result) => result.status >= 200 && result.status < 300
        );

        const failed = results.filter(
            (result) => result.status < 200 || result.status >= 300
        );

        console.log("");
        console.log("=================================");
        console.log("STRESS TEST RESULT");
        console.log("=================================");

        console.log(`Total requests : ${results.length}`);
        console.log(`Successful     : ${successful.length}`);
        console.log(`Failed         : ${failed.length}`);

        // =========================================
        // 6. Status distribution
        // =========================================

        const statusCounts = {};

        for (const result of results) {

            statusCounts[result.status] =
                (statusCounts[result.status] || 0) + 1;
        }

        console.log("");
        console.log("HTTP Status Distribution:");

        console.table(statusCounts);

        // =========================================
        // 7. Show errors
        // =========================================

        if (failed.length > 0) {

            console.log("");
            console.log("Failed Requests:");

            failed.slice(0, 10).forEach((result) => {

                console.log({
                    status: result.status,
                    data: result.data
                });

            });
        }

    } catch (error) {

        console.error("");
        console.error("Stress Test Error:");

        if (error.response) {

            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);

        } else {

            console.error(error.message);
        }
    }
}

runStressTest();