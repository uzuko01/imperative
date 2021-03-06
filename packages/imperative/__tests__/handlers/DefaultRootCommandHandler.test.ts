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

jest.mock("../../../imperative/src/ImperativeConfig");
jest.mock("../../../imperative/src/Imperative");

import { TestLogger } from "../../../../__tests__/TestLogger";
import { UnitTestUtils } from "../../../../__tests__/src/UnitTestUtils";
import { ICommandDefinition, CommandResponse, CommandPreparer, ICommandHandler } from "../../../cmd";
import { ICommandHandlerRequire } from "../../../cmd/src/doc/handler/ICommandHandlerRequire";
import { ImperativeConfig } from "../../src/ImperativeConfig";
(CommandResponse as any).spinnerChars = "-oO0)|(0Oo-";
process.env.FORCE_COLOR = "0";

export const COMPLEX_COMMAND: ICommandDefinition = {
    name: "test-group",
    description: "my group",
    type: "group",
    children: [
        {
            name: "test-command",
            description: "my command",
            type: "command",
            options: [
                {
                    name: "test-option",
                    description: "the option",
                    type: "string"
                },
                {
                    name: "test-boolean",
                    description: "the boolean option",
                    type: "boolean"
                }
            ],
            positionals: [
                {
                    name: "positional1",
                    description: "the positional option",
                    type: "string",
                    required: false
                }
            ]
        }
    ]
};

export const MULTIPLE_GROUPS: ICommandDefinition = {
    name: "test-outer-group",
    description: "test group",
    type: "group",
    children: [COMPLEX_COMMAND]
};

describe("Default Root Command Handler", () => {
    afterAll(() => {
        process.env.FORCE_COLOR = "1";
    });

    afterEach(() => {
        (ImperativeConfig as any).mInstance = null;
    });

    it("should display the help if no options are specified", async () => {
        // We also rely on ../src/__mocks__/ImperativeConfig.ts
        const prepared: ICommandDefinition = CommandPreparer.prepare(MULTIPLE_GROUPS);
        const cmdResp: CommandResponse = new CommandResponse({
            primaryTextColor: "yellow",
            silent: true
        });
        const commandHandler: ICommandHandlerRequire = require("../../src/handlers/DefaultRootCommandHandler");
        const handler: ICommandHandler = new commandHandler.default();

        await handler.process({
            response: cmdResp,
            arguments: {_: [], $0: ""},
            definition: prepared.children[0].children[0],
            fullDefinition: prepared,
            profiles: undefined
        });
        TestLogger.info("Help Text: \n" + cmdResp.buildJsonResponse().stdout);
        expect(cmdResp.buildJsonResponse().stdout.toString()).toMatchSnapshot();
    });

    it("should display the version if --version is specified", async () => {
        const cmdResp: CommandResponse = new CommandResponse({
            primaryTextColor: "yellow",
            silent: true
        });
        const commandHandler: ICommandHandlerRequire = require("../../src/handlers/DefaultRootCommandHandler");
        const handler: ICommandHandler = new commandHandler.default();

        await handler.process({
            response: cmdResp,
            arguments: {_: [], $0: "", version: true},
            definition: MULTIPLE_GROUPS.children[0].children[0],
            fullDefinition: MULTIPLE_GROUPS,
            profiles: undefined
        });
        TestLogger.info("Version Text: \n" + cmdResp.buildJsonResponse().stdout);
        expect(cmdResp.buildJsonResponse()).toMatchSnapshot();
    });
});
