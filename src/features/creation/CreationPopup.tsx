import { useAppSelector } from "../../app/hooks";
import networkObjectSlice, {
  selectNetworkObjects,
} from "../networkObject/DraftNetworkObjectSlice";
import ObjectCreationPopup from "../networkObject/ObjectCreationPopup";
import RuleCreationPopup from "../rules/RuleCreationPopup";
import { selectRule } from "../rules/ruleSlice";
import ServicePopUp from "../service/ServiceCreationPoopup";
import { selectService } from "../service/DraftServiceSlice";

function CreationPopup() {
  const serviceState = useAppSelector(selectService);
  const networkObjectState = useAppSelector(selectNetworkObjects);
  const ruleState = useAppSelector(selectRule);

  if (
    serviceState.newServiceStatus === "creating" ||
    serviceState.newServiceStatus === "editing"
  ) {
    return <ServicePopUp />;
  } else if (
    networkObjectState.newObjectStatus === "creating" ||
    networkObjectState.newObjectStatus === "editing"
  ) {
    return <ObjectCreationPopup />;
  } else if (ruleState.newRuleStatus === "creating") {
    return <RuleCreationPopup />;
  } else {
    return <></>;
  }
}

export default CreationPopup;
