/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { Session } from "../../src/session/Session";

describe("Session tests", () => {

    it("should store cookie token requested", () => {
        const cookie: object = ["LtpaToken2=7KM/bf1sE4+4pE5mKgf+slWo9JO6laQF6OOi/POW0C+hRwscFOFjUijI2eWZrMY+jL4F9" +
        "nl1ubUvcK0hPgWmKH4xCOf1EoNafu40XaiLoO8wZnCo/rHmP2/h7MzSJV1te8dP4VM6NFdQCruuxtcgddTiDXU8gYZERFTnvtYhUu" +
        "vk1Nne8xwo++sDAmEFVwvJbyg6Z0zT1RAGPIXd6hx8YPNXydAifoQhqI9CaoyZNptByyx2H7uJ0vt0HTNqrdgZclOQkDNMm65ETpdo" +
        "1u4U7Vd6HPoshHJEQo7p40T9jJfgv7PJ6Bxhp1dAqF5zEkqE; path=/; domain=ca23; Secure; HttpOnly; Expires=Tue, 19" +
        " Jan 2038 03:14:07 GMT;"];
        const session = new Session({hostname: "localhost", type: "token", tokenType: "LtpaToken2", user: "user", password: "password"});
        session.storeCookie(cookie);
        expect(session.ISession).toMatchSnapshot();
    });

    it("should initialize with basic type and required input data", () => {
        const session = new Session({hostname: "localhost", type: "basic", user: "ibmuser", password: "mypass"});
        expect(session.ISession).toMatchSnapshot();
    });

    it("should get user and password from an auth string", () => {
        const user = "myname";
        const password = "mypass";
        const auth = Session.getBase64Auth(user, password);
        expect(auth).toMatchSnapshot();
        expect(Session.getUsernameFromAuth(auth)).toBe(user);
        expect(Session.getPasswordFromAuth(auth)).toBe(password);
    });

    it("should require user for 'basic' type", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", type: "basic"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should not allow tokenType for 'basic' type", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", type: "basic", user: "hey", password: "there", tokenType: "LtpaToken2"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should not allow tokenValue for 'basic' type", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", type: "basic", user: "hey", password: "there", tokenValue: "secretToken"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should require password for 'basic' type", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", type: "basic", user: "somebody"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should require password for 'tokenType' type", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", type: "token", user: "somebody", password: "secret"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should not require user and password for 'token' type", () => {
        const session = new Session({hostname: "localhost", type: "token", tokenType: "LtpaToken2", tokenValue: "blahblahblah"});
        expect(session.ISession).toMatchSnapshot();
    });

    it("should not fail to initialize with minimum data", () => {
        const session = new Session({hostname: "localhost"});
        expect(session.ISession).toMatchSnapshot();
    });

    it("should match non-default port, protocol, secure protocol, and host", () => {
        const session = new Session({hostname: "localhost", port: "123", protocol: "http", secureProtocol: "somethingNew"});
        expect(session.ISession).toMatchSnapshot();
    });

    it("should match other non-default values", () => {
        const session = new Session({hostname: "localhost", rejectUnauthorized: false, strictSSL: false, checkServerIdentity: () => undefined});
        expect(session.ISession).toMatchSnapshot();
    });

    it("should require proper type", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", type: "madeThisUp"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should require proper protocol", () => {
        let error;
        try {
            const session = new Session({hostname: "localhost", protocol: "ftp"});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should fail to initialize without minimum data", () => {
        let error;
        try {
            const session = new Session({});
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });
});
