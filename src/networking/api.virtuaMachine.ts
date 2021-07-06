import { Api as API } from './api';
import { HTTP } from './http';

export namespace Api {
  export namespace VirtualMachine {
    enum Path {
      StartSimulator = 'simulators',
      StartSession = 'sessions',
      StopSession = 'sessions',
    }

    type StartSimulatorParams = {
      simulatorIdentifier: string;
      deviceTypeIdentifier: string;
    };
    export const startSimulator = (
      virtualMachineUrl: string,
      params: StartSimulatorParams
    ): API.Request => ({
      url: `${virtualMachineUrl}/${Path.StartSimulator}`,
      method: HTTP.Method.POST,
      params,
    });

    type StartSessionParams = {
      simulatorIdentifier: string;
    };
    export const startSession = (
      virtualMachineUrl: string,
      params: StartSessionParams
    ): API.Request => ({
      url: `${virtualMachineUrl}/${Path.StartSession}`,
      method: HTTP.Method.POST,
      params,
    });

    type StopSessionParams = {
      simulatorIdentifier: string;
    };
    export const stopSession = (
      virtualMachineUrl: string,
      params: StopSessionParams
    ): API.Request => ({
      url: `${virtualMachineUrl}/${Path.StopSession}/${params.simulatorIdentifier}`,
      method: HTTP.Method.DELETE,
    });
  }
}
