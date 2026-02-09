import type { UseCase } from "../types";

import { automationUseCases } from "./automation";
import { developerUseCases } from "./developer";
import { smartHomeUseCases } from "./smart-home";
import { productivityUseCases } from "./productivity";
import { multiAgentUseCases } from "./multi-agent";
import { familyUseCases } from "./family";
import { creativeUseCases } from "./creative";
import { hardwareUseCases } from "./hardware";
import { learningUseCases } from "./learning";

export {
  automationUseCases,
  developerUseCases,
  smartHomeUseCases,
  productivityUseCases,
  multiAgentUseCases,
  familyUseCases,
  creativeUseCases,
  hardwareUseCases,
  learningUseCases,
};

// All use cases are aggregated here for the adapter layer.
export const allUseCases: UseCase[] = [
  ...automationUseCases,
  ...developerUseCases,
  ...smartHomeUseCases,
  ...productivityUseCases,
  ...multiAgentUseCases,
  ...familyUseCases,
  ...creativeUseCases,
  ...hardwareUseCases,
  ...learningUseCases,
];
