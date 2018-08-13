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

import { IImperativeEnvironmentalVariableSetting } from "./IImperativeEnvironmentalVariableSetting";

/**
 * Interface representing variables set via environmental
 * variables for CLIs based on Imperative
 */
export interface IImperativeEnvironmentalVariableSettings {
    /**
     * Override the log level for the "imperative" log file for your CLI
     * @type {IImperativeEnvironmentalVariableSetting}
     */
    imperativeLogLevel?: IImperativeEnvironmentalVariableSetting;
    /**
     * Override the log level for the app log file (named after your CLI project)
     * @type {IImperativeEnvironmentalVariableSetting}
     */
    appLogLevel?: IImperativeEnvironmentalVariableSetting;

    /**
     * The home for the CLI where logs, profiles, and other data are stored
     * @type {IImperativeEnvironmentalVariableSetting}
     */
    cliHome?: IImperativeEnvironmentalVariableSetting;
}
