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

import { ICommandHandler, IHandlerParameters } from "../../../../../cmd";
import { Logger } from "../../../../../logger/";
import { ImperativeError } from "../../../../../error";
import { AppSettings } from "../../../../../settings/src/AppSettings";
import { Imperative } from "../../../Imperative";


/**
 * The set command group handler for cli configuration settings.
 *
 */
export default class SetHandler implements ICommandHandler {
  private static CONFIG_CREGENTIAL_MANAGER: string = "credential-manager";

  /**
   * A logger for this class
   *
   * @private
   * @type {Logger}
   */
  private log: Logger = Logger.getImperativeLogger();

  /**
   * Process the command and input.
   *
   * @param {IHandlerParameters} params Parameters supplied by yargs
   *
   * @throws {ImperativeError}
   */
  public async process(params: IHandlerParameters): Promise<void> {

    switch(params.arguments.configName){
      case SetHandler.CONFIG_CREGENTIAL_MANAGER:
        this.overrideCredentialManager(params.arguments.configValue);
        break;
      default :
        throw new ImperativeError({
          msg: "The setting you tried to change does not exist.",
          additionalDetails: JSON.stringify(params)
        });
    }
  }

  private async overrideCredentialManager(value: string) {
    await AppSettings.instance.setNewOverride("CredentialManager", value);
  }
}
