import { useAppSelector } from "../../app/hooks";
import networkObjectSlice, {
  selectNetworkObjects,
} from "../networkObject/networkObjectSlice";
import ObjectCreationPopup from "../networkObject/ObjectCreationPopup";
import RuleCreationPopup from "../rules/RuleCreationPopup";
import { selectRule } from "../rules/ruleSlice";
import ServiceCreationPopup from "../service/ServiceCreationPoopup";
import { selectService } from "../service/serviceSlice";

function CreationPopup() {
  const serviceState = useAppSelector(selectService);
  const networkObjectState = useAppSelector(selectNetworkObjects);
  const ruleState = useAppSelector(selectRule);

  if (serviceState.newServiceStatus === "creating") {
    return <ServiceCreationPopup />;
  } else if (networkObjectState.newObjectStatus === "creating") {
    return <ObjectCreationPopup />;
  } else if (ruleState.newRuleStatus === "creating") {
    return <RuleCreationPopup />;
  } else {
    return <></>;
  }
}

export default CreationPopup;
