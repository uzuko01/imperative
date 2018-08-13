/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { ICommandDefinition } from "../../../../../../packages/index";
import { syntaxTestCommand } from "./syntax/Syntax.definition";

export const definition: ICommandDefinition = {
    name: "validate",
    description: "Invoke commands to validate that syntax checking is working correctly.",
    summary: "Validate syntax checking",
    type: "group",
    children: [syntaxTestCommand]
};

module.exports = definition;
